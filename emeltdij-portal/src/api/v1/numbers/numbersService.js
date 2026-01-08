const PremiumNumber = require('../../../models/PremiumNumber');
const { Op, fn, col, where: sqlWhere } = require('sequelize');

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

async function listNumbersWithSearch({
  companyId,
  clientId,
  status,
  offset,
  limit,
  search,
} = {}) {
  const where = {};
  if (companyId) where.companyId = companyId;
  if (clientId) where.clientId = clientId;
  if (status) where.status = status;

  if (search) {
    const q = String(search).toLowerCase();
    const like = `%${q}%`;
    where[Op.or] = [sqlWhere(fn('LOWER', col('number')), { [Op.like]: like })];
  }

  return PremiumNumber.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });
}

async function createNumber(data, user) {
  return PremiumNumber.create(data, { user });
}

async function updateNumber(id, data, user) {
  const number = await PremiumNumber.findByPk(id);
  if (!number) return null;
  await number.update(data, { user });
  return number;
}

module.exports = {
  listNumbers: listNumbersWithSearch,
  createNumber,
  updateNumber,
};
