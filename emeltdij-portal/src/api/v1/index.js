const express = require('express');

const { companiesRouter } = require('./companies/companiesRoutes');

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
  });
});

router.use('/companies', companiesRouter);

module.exports = { apiV1Router: router };
