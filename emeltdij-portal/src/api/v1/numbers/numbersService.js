const PremiumNumber = require('../../../models/PremiumNumber');

async function listNumbers({ companyId, clientId, status, offset, limit } = {}) {
  const where = {};
  if (companyId) where.companyId = companyId;
  if (clientId) where.clientId = clientId;
  if (status) where.status = status;

  return PremiumNumber.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });
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
