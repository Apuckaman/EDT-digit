const { ApiError } = require('../../../errors/ApiError');
const Company = require('../../../models/Company');
const Client = require('../../../models/Client');
const { parsePagination, buildListResponse } = require('../pagination');
const {
  listClients,
  createClient,
  updateClient,
  softDeleteClient,
} = require('./clientsService');

function parseOptionalInt(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) ? n : NaN;
}

function validateClientPayload(body, { partial = false } = {}) {
  const details = {};

  function requireString(field) {
    const v = body[field];
    if (typeof v !== 'string' || v.trim() === '') {
      details[field] = 'Required string';
    }
  }

  if (!partial || body.code !== undefined) requireString('code');
  if (!partial || body.name !== undefined) requireString('name');
  if (!partial || body.billingAddress !== undefined)
    requireString('billingAddress');

  if (!partial || body.companyId !== undefined) {
    const cid = parseOptionalInt(body.companyId);
    if (!Number.isFinite(cid)) {
      details.companyId = 'Must be an integer';
    } else if (cid === null) {
      details.companyId = 'Required';
    }
  }

  if (body.email !== undefined && body.email !== null) {
    if (typeof body.email !== 'string') details.email = 'Must be a string or null';
  }
  if (body.phone !== undefined && body.phone !== null) {
    if (typeof body.phone !== 'string') details.phone = 'Must be a string or null';
  }
  if (body.active !== undefined) {
    if (typeof body.active !== 'boolean') details.active = 'Must be a boolean';
  }

  if (Object.keys(details).length) {
    throw ApiError.badRequest(
      'VALIDATION_ERROR',
      'Invalid client payload',
      details
    );
  }
}

async function getClients(req, res) {
  const { page, limit, offset } = parsePagination(req.query);

  const companyId = parseOptionalInt(req.query.companyId);
  if (Number.isNaN(companyId)) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid companyId', {
      companyId: 'Must be an integer',
    });
  }

  let status = null;
  if (req.query.status !== undefined) {
    const v = String(req.query.status);
    if (v === 'active') status = true;
    else if (v === 'inactive') status = false;
    else {
      throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid status', {
        status: 'Must be one of: active, inactive',
      });
    }
  }

  const search =
    typeof req.query.search === 'string' && req.query.search.trim() !== ''
      ? req.query.search.trim()
      : null;

  const result = await listClients({
    companyId: companyId || null,
    status,
    offset,
    limit,
    search,
  });

  res.json(buildListResponse(result.rows, { page, limit, total: result.count }));
}

async function postClient(req, res) {
  validateClientPayload(req.body, { partial: false });

  const companyId = parseOptionalInt(req.body.companyId);
  const company = await Company.findByPk(companyId);
  if (!company) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid companyId', {
      companyId: 'Company does not exist',
    });
  }
  if (!company.active) {
    throw ApiError.conflict(
      'BUSINESS_RULE_VIOLATION',
      'Cannot create client for inactive company',
      { companyId }
    );
  }

  try {
    const client = await createClient({
      code: req.body.code,
      name: req.body.name,
      billingAddress: req.body.billingAddress,
      email: req.body.email ?? null,
      phone: req.body.phone ?? null,
      companyId,
      active: req.body.active ?? true,
    }, req.user);
    res.status(201).json(client);
  } catch (err) {
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      throw ApiError.conflict(
        'CLIENT_CODE_EXISTS',
        'Client code must be unique',
        { field: 'code' }
      );
    }
    throw err;
  }
}

async function putClient(req, res) {
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid client id', {
      id: 'Must be an integer',
    });
  }

  validateClientPayload(req.body, { partial: true });

  const existing = await Client.findByPk(id);
  if (!existing) throw ApiError.notFound('Client not found', { id });

  const targetCompanyId =
    req.body.companyId !== undefined
      ? parseOptionalInt(req.body.companyId)
      : existing.companyId;

  const company = await Company.findByPk(targetCompanyId);
  if (!company) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid companyId', {
      companyId: 'Company does not exist',
    });
  }
  if (!company.active) {
    throw ApiError.conflict(
      'BUSINESS_RULE_VIOLATION',
      'Client cannot be modified because company is inactive',
      { companyId: targetCompanyId }
    );
  }

  try {
    const updated = await updateClient(id, req.body, req.user);
    res.json(updated);
  } catch (err) {
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      throw ApiError.conflict(
        'CLIENT_CODE_EXISTS',
        'Client code must be unique',
        { field: 'code' }
      );
    }
    throw err;
  }
}

module.exports = {
  getClients,
  postClient,
  putClient,
  deleteClient: async function deleteClient(req, res) {
    const id = parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) {
      throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid client id', {
        id: 'Must be an integer',
      });
    }

    const client = await softDeleteClient(id, req.user);
    if (!client) throw ApiError.notFound('Client not found', { id });
    res.json(client);
  },
};

