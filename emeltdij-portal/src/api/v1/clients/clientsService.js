const Client = require('../../../models/Client');

async function listClients({ companyId, offset, limit, status } = {}) {
  const where = {};
  if (companyId) where.companyId = companyId;
  if (status !== undefined && status !== null) where.active = status;

  return Client.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });
}

async function createClient(data) {
  return Client.create(data);
}

async function updateClient(id, data) {
  const client = await Client.findByPk(id);
  if (!client) return null;
  await client.update(data);
  return client;
}

async function softDeleteClient(id) {
  const client = await Client.findByPk(id);
  if (!client) return null;
  await client.update({ active: false });
  return client;
}

module.exports = {
  listClients,
  createClient,
  updateClient,
  softDeleteClient,
};
