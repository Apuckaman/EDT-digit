const { ApiError } = require('../../../errors/ApiError');
const Company = require('../../../models/Company');
const Client = require('../../../models/Client');
const { listNumbers, createNumber, updateNumber } = require('./numbersService');

function parseOptionalInt(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) ? n : NaN;
}

function validateNumberPayload(body, { partial = false } = {}) {
  const details = {};

  function requireString(field) {
    const v = body[field];
    if (typeof v !== 'string' || v.trim() === '') {
      details[field] = 'Required string';
    }
  }

  if (!partial || body.number !== undefined) requireString('number');

  if (!partial || body.clientId !== undefined) {
    const cid = parseOptionalInt(body.clientId);
    if (!Number.isFinite(cid)) details.clientId = 'Must be an integer';
    else if (cid === null) details.clientId = 'Required';
  }

  if (!partial || body.companyId !== undefined) {
    const coid = parseOptionalInt(body.companyId);
    if (!Number.isFinite(coid)) details.companyId = 'Must be an integer';
    else if (coid === null) details.companyId = 'Required';
  }

  if (body.provider !== undefined && body.provider !== null) {
    if (typeof body.provider !== 'string') details.provider = 'Must be a string or null';
  }

  if (body.pricingPlan !== undefined && body.pricingPlan !== null) {
    if (typeof body.pricingPlan !== 'string') details.pricingPlan = 'Must be a string or null';
  }

  if (body.active !== undefined) {
    if (typeof body.active !== 'boolean') details.active = 'Must be a boolean';
  }

  if (Object.keys(details).length) {
    throw ApiError.badRequest(
      'VALIDATION_ERROR',
      'Invalid premium number payload',
      details
    );
  }
}

async function getNumbers(req, res) {
  const companyId = parseOptionalInt(req.query.companyId);
  const clientId = parseOptionalInt(req.query.clientId);

  if (Number.isNaN(companyId)) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid companyId', {
      companyId: 'Must be an integer',
    });
  }
  if (Number.isNaN(clientId)) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid clientId', {
      clientId: 'Must be an integer',
    });
  }

  const items = await listNumbers({
    companyId: companyId || null,
    clientId: clientId || null,
  });

  res.json(items);
}

async function postNumber(req, res) {
  validateNumberPayload(req.body, { partial: false });

  const companyId = parseOptionalInt(req.body.companyId);
  const clientId = parseOptionalInt(req.body.clientId);

  const company = await Company.findByPk(companyId);
  if (!company) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid companyId', {
      companyId: 'Company does not exist',
    });
  }

  const client = await Client.findByPk(clientId);
  if (!client) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid clientId', {
      clientId: 'Client does not exist',
    });
  }

  try {
    const number = await createNumber({
      number: req.body.number,
      clientId,
      companyId,
      provider: req.body.provider ?? null,
      pricingPlan: req.body.pricingPlan ?? null,
      active: req.body.active ?? true,
    });
    res.status(201).json(number);
  } catch (err) {
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      throw ApiError.conflict(
        'PREMIUM_NUMBER_EXISTS',
        'Number must be unique per company',
        { fields: ['companyId', 'number'] }
      );
    }
    throw err;
  }
}

async function putNumber(req, res) {
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid number id', {
      id: 'Must be an integer',
    });
  }

  validateNumberPayload(req.body, { partial: true });

  if (req.body.companyId !== undefined) {
    const companyId = parseOptionalInt(req.body.companyId);
    const company = await Company.findByPk(companyId);
    if (!company) {
      throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid companyId', {
        companyId: 'Company does not exist',
      });
    }
  }

  if (req.body.clientId !== undefined) {
    const clientId = parseOptionalInt(req.body.clientId);
    const client = await Client.findByPk(clientId);
    if (!client) {
      throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid clientId', {
        clientId: 'Client does not exist',
      });
    }
  }

  try {
    const updated = await updateNumber(id, req.body);
    if (!updated) throw ApiError.notFound('Premium number not found', { id });
    res.json(updated);
  } catch (err) {
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      throw ApiError.conflict(
        'PREMIUM_NUMBER_EXISTS',
        'Number must be unique per company',
        { fields: ['companyId', 'number'] }
      );
    }
    throw err;
  }
}

module.exports = {
  getNumbers,
  postNumber,
  putNumber,
};

