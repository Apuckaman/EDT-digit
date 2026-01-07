const PremiumNumber = require('../../../models/PremiumNumber');

async function listNumbers({ companyId, clientId } = {}) {
  const where = {};
  if (companyId) where.companyId = companyId;
  if (clientId) where.clientId = clientId;
  return PremiumNumber.findAll({ where, order: [['id', 'ASC']] });
}

async function createNumber(data) {
  return PremiumNumber.create(data);
}

async function updateNumber(id, data) {
  const number = await PremiumNumber.findByPk(id);
  if (!number) return null;
  await number.update(data);
  return number;
}

module.exports = {
  listNumbers,
  createNumber,
  updateNumber,
};
