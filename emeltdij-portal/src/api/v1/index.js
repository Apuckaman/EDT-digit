const express = require('express');

const { companiesRouter } = require('./companies/companiesRoutes');
const { clientsRouter } = require('./clients/clientsRoutes');
const { asyncHandler } = require('../../middleware/asyncHandler');
const { testConnection } = require('../../db');
const { ApiError } = require('../../errors/ApiError');

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
  });
});

// Ready check: DB kapcsolat kötelező
router.get(
  '/ready',
  asyncHandler(async (req, res) => {
    const ok = await testConnection();
    if (!ok) {
      throw new ApiError(
        503,
        'DB_NOT_READY',
        'Database is not reachable',
        {}
      );
    }
    res.json({ status: 'ok', db: 'connected' });
  })
);

router.use('/companies', companiesRouter);
router.use('/clients', clientsRouter);

module.exports = { apiV1Router: router };
