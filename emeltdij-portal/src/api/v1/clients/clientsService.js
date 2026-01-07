const Client = require('../../../models/Client');

async function listClients({ companyId } = {}) {
  const where = {};
  if (companyId) where.companyId = companyId;
  return Client.findAll({ where, order: [['id', 'ASC']] });
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

module.exports = {
  listClients,
  createClient,
  updateClient,
};
