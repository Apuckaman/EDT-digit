const Client = require('../../../models/Client');
const { Op, fn, col, where: sqlWhere } = require('sequelize');

async function listClients({ companyId, offset, limit, status, search } = {}) {
  const where = {};
  if (companyId) where.companyId = companyId;
  if (status !== undefined && status !== null) where.active = status;

  if (search) {
    const q = String(search).toLowerCase();
    const like = `%${q}%`;
    where[Op.or] = [sqlWhere(fn('LOWER', col('name')), { [Op.like]: like })];
  }

  return Client.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });
}

async function createClient(data, user) {
  return Client.create(data, { user });
}

async function updateClient(id, data, user) {
  const client = await Client.findByPk(id);
  if (!client) return null;
  await client.update(data, { user });
  return client;
}

async function softDeleteClient(id, user) {
  const client = await Client.findByPk(id);
  if (!client) return null;
  await client.update({ active: false }, { user });
  return client;
}

module.exports = {
  listClients,
  createClient,
  updateClient,
  softDeleteClient,
};
