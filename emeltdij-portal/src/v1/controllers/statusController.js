const { companies, clients, numbers, trafficRaw } = require('../data/mockData');

function getStatus(req, res) {
  const payload = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    counts: {
      companies: companies.length,
      clients: clients.length,
      numbers: numbers.length,
      trafficRaw: trafficRaw.length
    }
  };
  res.json(payload);
}

module.exports = {
  getStatus
};
