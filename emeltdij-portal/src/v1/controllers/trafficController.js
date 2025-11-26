const { trafficRaw } = require('../data/mockData');
const { aggregateMonthly } = require('../services/trafficService');

// GET /traffic/raw
function getRawTraffic(req, res) {
  const { number, month, companyId } = req.query;
  let result = [...trafficRaw];

  if (number) {
    result = result.filter((t) => t.number === number);
  }

  if (month) {
    result = result.filter((t) => t.month === month);
  }

  if (companyId) {
    const coid = parseInt(companyId, 10);
    result = result.filter((t) => t.companyId === coid);
  }

  res.json(result);
}

// GET /traffic/monthly
function getMonthlyTraffic(req, res) {
  const { month } = req.query;
  const result = aggregateMonthly(trafficRaw, month || null);
  res.json(result);
}

// POST /traffic/raw/preview
function previewRawTraffic(req, res) {
  const body = req.body;

  if (!Array.isArray(body)) {
    return res.status(400).json({
      error: 'A kérés törzsében tömböt várok (Array) forgalmi sorokkal.'
    });
  }

  const preview = aggregateMonthly(body, null);

  res.json({
    rowsReceived: body.length,
    preview
  });
}

module.exports = {
  getRawTraffic,
  getMonthlyTraffic,
  previewRawTraffic
};
