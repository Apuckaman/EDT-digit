const express = require('express');

const router = express.Router();

router.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
  });
});

module.exports = { apiV1Router: router };
