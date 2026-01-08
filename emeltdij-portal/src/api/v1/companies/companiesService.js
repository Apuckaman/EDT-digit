const Company = require('../../../models/Company');

async function listCompanies({ offset, limit, status } = {}) {
  const where = {};
  if (status !== undefined && status !== null) where.active = status;

  return Company.findAndCountAll({
    where,
    order: [['createdAt', 'DESC']],
    offset,
    limit,
  });
}

async function getCompanyById(id) {
  return Company.findByPk(id);
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

async function softDeleteCompany(id) {
  const company = await Company.findByPk(id);
  if (!company) return null;
  await company.update({ active: false });
  return company;
}

module.exports = {
  listCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  softDeleteCompany,
};
