const { numbers } = require('../data/mockData');

function getNumbers(req, res) {
  const { clientId, companyId } = req.query;
  let result = [...numbers];

  if (clientId) {
    const cid = parseInt(clientId, 10);
    result = result.filter((n) => n.clientId === cid);
  }

  if (companyId) {
    const coid = parseInt(companyId, 10);
    result = result.filter((n) => n.companyId === coid);
  }

  res.json(result);
}

module.exports = {
  getNumbers
};
