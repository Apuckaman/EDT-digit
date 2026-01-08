const { ApiError } = require('../../../../errors/ApiError');
const { ImportRun } = require('../../../../models');

function parseLimit(value, fallback) {
  if (value === undefined) return fallback;
  const n = parseInt(String(value), 10);
  if (!Number.isFinite(n) || n < 1 || n > 100) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid limit', {
      limit: 'Must be an integer between 1 and 100',
    });
  }
  return n;
}

async function listImportRuns(req, res) {
  // S6-06: default legutóbbi 20
  const limit = parseLimit(req.query.limit, 20);

  const runs = await ImportRun.findAll({
    order: [['startedAt', 'DESC']],
    limit,
  });

  res.json({ data: runs });
}

async function getImportRun(req, res) {
  const id = String(req.params.id || '').trim();
  if (!id) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid importId', {
      id: 'Required',
    });
  }

  const run = await ImportRun.findByPk(id);
  if (!run) {
    throw ApiError.notFound('Import run not found', { id });
  }

  // rows mezőben csak FAILED sorok vannak eltárolva (S6-06)
  res.json({ data: run });
}

module.exports = {
  listImportRuns,
  getImportRun,
};

