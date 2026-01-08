const { randomUUID } = require('crypto');

const { sequelize } = require('../../../../db');
const Company = require('../../../../models/Company');
const Client = require('../../../../models/Client');
const PremiumNumber = require('../../../../models/PremiumNumber');
const { ImportRun } = require('../../../../models');
const { ImportErrorCodes } = require('./importErrorCodes');

const { parse } = require('csv-parse/sync');

const ALLOWED_NUMBER_STATUSES = new Set(['active', 'suspended', 'archived']);

function normalizeStr(v) {
  if (v === undefined || v === null) return '';
  return String(v).trim();
}

function makeRowError(code, message, field) {
  return { code, message, field };
}

function parseCsv(buffer) {
  try {
    const records = parse(buffer, {
      bom: true,
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: false,
    });
    return { records };
  } catch (e) {
    return { error: e };
  }
}

function getRowNumber(index) {
  // header = row 1, data rows start at row 2
  return index + 2;
}

async function runImport({ file, mode, user }) {
  const importId = randomUUID();

  const run = await ImportRun.create({
    id: importId,
    type: 'premium-numbers',
    mode,
    username: user.username || String(user.id),
    fileName: file.originalname || null,
    startedAt: new Date(),
    finishedAt: null,
    summary: null,
  });

  const parsed = parseCsv(file.buffer);
  if (parsed.error) {
    await run.update({
      finishedAt: new Date(),
      summary: { error: ImportErrorCodes.CSV_PARSE_ERROR },
    });
    const err = new Error('CSV parse error');
    err.code = ImportErrorCodes.CSV_PARSE_ERROR;
    err.original = parsed.error;
    throw err;
  }

  const rows = [];
  const summary = { total: 0, created: 0, updated: 0, skipped: 0, failed: 0 };

  for (let i = 0; i < parsed.records.length; i++) {
    const r = parsed.records[i] || {};
    const rowNumber = getRowNumber(i);

    const company_taxNumber = normalizeStr(r.company_taxNumber);
    const company_name = normalizeStr(r.company_name);
    const client_name = normalizeStr(r.client_name);
    const number = normalizeStr(r.number);
    const number_status_raw = normalizeStr(r.number_status);
    const number_status = number_status_raw ? number_status_raw : 'active';

    const errors = [];

    if (!company_taxNumber) {
      errors.push(
        makeRowError(
          ImportErrorCodes.MISSING_REQUIRED_FIELD,
          'company_taxNumber is required',
          'company_taxNumber'
        )
      );
    }
    if (!company_name) {
      errors.push(
        makeRowError(
          ImportErrorCodes.MISSING_REQUIRED_FIELD,
          'company_name is required',
          'company_name'
        )
      );
    }
    if (!client_name) {
      errors.push(
        makeRowError(
          ImportErrorCodes.MISSING_REQUIRED_FIELD,
          'client_name is required',
          'client_name'
        )
      );
    }
    if (!number) {
      errors.push(
        makeRowError(
          ImportErrorCodes.MISSING_REQUIRED_FIELD,
          'number is required',
          'number'
        )
      );
    }
    if (!ALLOWED_NUMBER_STATUSES.has(number_status)) {
      errors.push(
        makeRowError(
          ImportErrorCodes.INVALID_ENUM_VALUE,
          'number_status must be one of: active, suspended, archived',
          'number_status'
        )
      );
    }

    summary.total += 1;

    if (errors.length) {
      rows.push({
        rowNumber,
        status: 'FAILED',
        entity: 'number',
        keys: { company_taxNumber, client_name, number },
        errors,
      });
      summary.failed += 1;
      continue;
    }

    // dry-run logic: compute would-be actions based on current DB state
    const existingCompany = await Company.findOne({
      where: { taxNumber: company_taxNumber },
    });

    const effects = { created: false, updated: false };

    if (existingCompany && !existingCompany.active) {
      // inactive company: block if name mismatch OR any downstream action
      if (existingCompany.name !== company_name) {
        errors.push(
          makeRowError(
            ImportErrorCodes.COMPANY_INACTIVE,
            'Company is inactive and name differs',
            'company_name'
          )
        );
      } else {
        errors.push(
          makeRowError(
            ImportErrorCodes.COMPANY_INACTIVE,
            'Company is inactive',
            'company_taxNumber'
          )
        );
      }
    }

    // short-circuit on company inactive
    if (errors.length) {
      rows.push({
        rowNumber,
        status: 'FAILED',
        entity: 'company',
        keys: { company_taxNumber, client_name, number },
        errors,
      });
      summary.failed += 1;
      continue;
    }

    // Apply writes in apply mode (idempotent, row-isolated transaction)
    if (mode === 'apply') {
      await sequelize.transaction(async (tx) => {
        let company = await Company.findOne({
          where: { taxNumber: company_taxNumber },
          transaction: tx,
          lock: tx.LOCK.UPDATE,
        });

        if (!company) {
          company = await Company.create(
            {
              name: company_name,
              taxNumber: company_taxNumber,
              type: 'AFAS',
              active: true,
            },
            { transaction: tx, user }
          );
          effects.created = true;
        } else {
          if (!company.active) {
            throw new Error(ImportErrorCodes.COMPANY_INACTIVE);
          }
          if (company.name !== company_name) {
            await company.update({ name: company_name }, { transaction: tx, user });
            effects.updated = true;
          }
        }

        let client = await Client.findOne({
          where: { companyId: company.id, name: client_name },
          transaction: tx,
          lock: tx.LOCK.UPDATE,
        });

        if (!client) {
          client = await Client.create(
            {
              code: `IMP-${company.id}-${client_name}`.slice(0, 20),
              name: client_name,
              billingAddress: 'IMPORT',
              email: null,
              phone: null,
              companyId: company.id,
              active: true,
            },
            { transaction: tx, user }
          );
          effects.created = true;
        }

        let pn = await PremiumNumber.findOne({
          where: { number },
          transaction: tx,
          lock: tx.LOCK.UPDATE,
        });

        if (!pn) {
          pn = await PremiumNumber.create(
            {
              number,
              companyId: company.id,
              clientId: client.id,
              provider: null,
              pricingPlan: null,
              status: number_status,
            },
            { transaction: tx, user }
          );
          effects.created = true;
        } else {
          if (pn.status === 'archived') {
            const e = new Error(ImportErrorCodes.NUMBER_ARCHIVED);
            e.code = ImportErrorCodes.NUMBER_ARCHIVED;
            throw e;
          }

          const patch = {};
          if (pn.companyId !== company.id) patch.companyId = company.id;
          if (pn.clientId !== client.id) patch.clientId = client.id;
          if (pn.status !== number_status) patch.status = number_status;

          if (Object.keys(patch).length) {
            await pn.update(patch, { transaction: tx, user });
            effects.updated = true;
          }
        }
      });
    } else {
      // dry-run: simulate effects without writing
      if (!existingCompany) effects.created = true;
      else if (existingCompany.name !== company_name) effects.updated = true;

      // cannot deterministically know client code collisions without writes; treat client create as created if missing
      const companyId = existingCompany ? existingCompany.id : null;
      if (companyId) {
        const existingClient = await Client.findOne({
          where: { companyId, name: client_name },
        });
        if (!existingClient) effects.created = true;
      } else {
        effects.created = true;
      }

      const existingNumber = await PremiumNumber.findOne({ where: { number } });
      if (!existingNumber) effects.created = true;
      else if (existingNumber.status === 'archived') {
        errors.push(
          makeRowError(
            ImportErrorCodes.NUMBER_ARCHIVED,
            'Archived number cannot be modified',
            'number'
          )
        );
      } else {
        if (existingNumber.status !== number_status) effects.updated = true;
      }

      if (errors.length) {
        rows.push({
          rowNumber,
          status: 'FAILED',
          entity: 'number',
          keys: { company_taxNumber, client_name, number },
          errors,
        });
        summary.failed += 1;
        continue;
      }
    }

    let rowStatus = 'SKIPPED';
    if (effects.created) rowStatus = 'CREATED';
    else if (effects.updated) rowStatus = 'UPDATED';

    rows.push({
      rowNumber,
      status: rowStatus,
      entity: 'number',
      keys: { company_taxNumber, client_name, number },
      errors: [],
    });

    if (rowStatus === 'CREATED') summary.created += 1;
    else if (rowStatus === 'UPDATED') summary.updated += 1;
    else summary.skipped += 1;
  }

  await run.update({
    finishedAt: new Date(),
    summary,
  });

  return { importId, summary, rows };
}

module.exports = {
  runImport,
};

