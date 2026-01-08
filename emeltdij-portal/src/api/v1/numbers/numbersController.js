const { ApiError } = require('../../../errors/ApiError');
const Company = require('../../../models/Company');
const Client = require('../../../models/Client');
const PremiumNumber = require('../../../models/PremiumNumber');
const { listNumbers, createNumber, updateNumber } = require('./numbersService');
const { parsePagination } = require('../pagination');

const ALLOWED_STATUSES = new Set(['active', 'suspended', 'archived']);

function parseOptionalInt(value) {
  if (value === undefined || value === null || value === '') return null;
  const n = parseInt(String(value), 10);
  return Number.isFinite(n) ? n : NaN;
}

function isValidStatusTransition(fromStatus, toStatus) {
  if (fromStatus === toStatus) return true;
  if (fromStatus === 'active') return toStatus === 'suspended' || toStatus === 'archived';
  if (fromStatus === 'suspended') return toStatus === 'active' || toStatus === 'archived';
  if (fromStatus === 'archived') return false;
  return false;
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

  if (body.status !== undefined) {
    if (typeof body.status !== 'string' || !ALLOWED_STATUSES.has(body.status)) {
      details.status = 'Must be one of: active, suspended, archived';
    }
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
  const { page, limit, offset } = parsePagination(req.query);

  const companyId = parseOptionalInt(req.query.companyId);
  const clientId = parseOptionalInt(req.query.clientId);
  const status = req.query.status !== undefined ? String(req.query.status) : null;

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

  if (status !== null && !ALLOWED_STATUSES.has(status)) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid status', {
      status: 'Must be one of: active, suspended, archived',
    });
  }

  const result = await listNumbers({
    companyId: companyId || null,
    clientId: clientId || null,
    status,
    offset,
    limit,
  });

  res.json({
    items: result.rows,
    page,
    limit,
    total: result.count,
  });
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
      status: req.body.status ?? 'active',
    });
    res.status(201).json(number);
  } catch (err) {
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      throw ApiError.conflict(
        'PREMIUM_NUMBER_EXISTS',
        'phone_number must be unique',
        { field: 'number' }
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
    const existing = await PremiumNumber.findByPk(id);
    if (!existing) throw ApiError.notFound('Premium number not found', { id });

    if (req.body.status !== undefined) {
      const toStatus = req.body.status;
      if (!isValidStatusTransition(existing.status, toStatus)) {
        throw ApiError.conflict(
          'INVALID_STATUS_TRANSITION',
          'Invalid status transition',
          { from: existing.status, to: toStatus }
        );
      }
    }

    const updated = await updateNumber(id, req.body);
    res.json(updated);
  } catch (err) {
    if (err && err.name === 'SequelizeUniqueConstraintError') {
      throw ApiError.conflict(
        'PREMIUM_NUMBER_EXISTS',
        'phone_number must be unique',
        { field: 'number' }
      );
    }
    throw err;
  }
}

async function deleteNumber(req, res) {
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid number id', {
      id: 'Must be an integer',
    });
  }

  const existing = await PremiumNumber.findByPk(id);
  if (!existing) throw ApiError.notFound('Premium number not found', { id });

  if (!isValidStatusTransition(existing.status, 'archived')) {
    throw ApiError.conflict(
      'INVALID_STATUS_TRANSITION',
      'Invalid status transition',
      { from: existing.status, to: 'archived' }
    );
  }

  const updated = await updateNumber(id, { status: 'archived' });
  res.json(updated);
}

module.exports = {
  getNumbers,
  postNumber,
  putNumber,
  deleteNumber,
};

