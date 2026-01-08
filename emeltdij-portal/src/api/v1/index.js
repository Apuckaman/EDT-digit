const express = require('express');

const { authRouter } = require('./auth/authRoutes');
const { adminRouter } = require('./admin/adminRoutes');
const { companiesRouter } = require('./companies/companiesRoutes');
const { clientsRouter } = require('./clients/clientsRoutes');
const { numbersRouter } = require('./numbers/numbersRoutes');
const { asyncHandler } = require('../../middleware/asyncHandler');
const { testConnection } = require('../../db');
const { ApiError } = require('../../errors/ApiError');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/admin', adminRouter);

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
router.use('/numbers', numbersRouter);

module.exports = { apiV1Router: router };
