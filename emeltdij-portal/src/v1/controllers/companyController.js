const { companies } = require('../data/mockData');

function getCompanies(req, res) {
  res.json(companies);
}

module.exports = {
  getCompanies
};
