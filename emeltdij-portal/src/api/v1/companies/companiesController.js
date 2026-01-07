const { ApiError } = require('../../../errors/ApiError');
const {
  listCompanies,
  createCompany,
  updateCompany,
} = require('./companiesService');

const ALLOWED_TYPES = new Set(['AFAS', 'AFAMENTES']);

function validateCompanyPayload(body, { partial = false } = {}) {
  const details = {};

  function requireString(field) {
    const v = body[field];
    if (typeof v !== 'string' || v.trim() === '') {
      details[field] = 'Required string';
    }
  }

  if (!partial || body.name !== undefined) {
    requireString('name');
  }

  if (!partial || body.taxNumber !== undefined) {
    requireString('taxNumber');
  }

  if (!partial || body.type !== undefined) {
    const v = body.type;
    if (typeof v !== 'string' || !ALLOWED_TYPES.has(v)) {
      details.type = 'Must be one of: AFAS, AFAMENTES';
    }
  }

  if (body.bankAccount !== undefined && body.bankAccount !== null) {
    if (typeof body.bankAccount !== 'string') {
      details.bankAccount = 'Must be a string or null';
    }
  }

  if (body.szamlazzApiKey !== undefined && body.szamlazzApiKey !== null) {
    if (typeof body.szamlazzApiKey !== 'string') {
      details.szamlazzApiKey = 'Must be a string or null';
    }
  }

  if (body.active !== undefined) {
    if (typeof body.active !== 'boolean') {
      details.active = 'Must be a boolean';
    }
  }

  if (Object.keys(details).length) {
    throw ApiError.badRequest(
      'VALIDATION_ERROR',
      'Invalid company payload',
      details
    );
  }
}

async function getCompanies(req, res) {
  const companies = await listCompanies();
  res.json(companies);
}

async function postCompany(req, res) {
  validateCompanyPayload(req.body, { partial: false });

  try {
    const company = await createCompany({
      name: req.body.name,
      taxNumber: req.body.taxNumber,
      type: req.body.type,
      bankAccount: req.body.bankAccount ?? null,
      szamlazzApiKey: req.body.szamlazzApiKey ?? null,
      active: req.body.active ?? true,
    });
    res.status(201).json(company);
  } catch (err) {
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      throw ApiError.conflict(
        'COMPANY_TAX_NUMBER_EXISTS',
        'Company taxNumber must be unique',
        { field: 'taxNumber' }
      );
    }
    throw err;
  }
}

async function putCompany(req, res) {
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid company id', {
      id: 'Must be an integer',
    });
  }

  validateCompanyPayload(req.body, { partial: true });

  try {
    const updated = await updateCompany(id, req.body);
    if (!updated) {
      throw ApiError.notFound('Company not found', { id });
    }
    res.json(updated);
  } catch (err) {
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      throw ApiError.conflict(
        'COMPANY_TAX_NUMBER_EXISTS',
        'Company taxNumber must be unique',
        { field: 'taxNumber' }
      );
    }
    throw err;
  }
}

module.exports = {
  getCompanies,
  postCompany,
  putCompany,
};
