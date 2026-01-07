const Company = require('../../../models/Company');

async function listCompanies() {
  return Company.findAll({ order: [['id', 'ASC']] });
}

async function createCompany(data) {
  return Company.create(data);
}

async function updateCompany(id, data) {
  const company = await Company.findByPk(id);
  if (!company) return null;
  await company.update(data);
  return company;
}

module.exports = {
  listCompanies,
  createCompany,
  updateCompany,
};
