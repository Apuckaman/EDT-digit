const { clients } = require('../data/mockData');

function getClients(req, res) {
  res.json(clients);
}

module.exports = {
  getClients
};
