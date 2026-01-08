const Company = require('../../../models/Company');
const { Op, fn, col, where: sqlWhere } = require('sequelize');

async function listCompanies({ offset, limit, status, search } = {}) {
  const where = {};
  if (status !== undefined && status !== null) where.active = status;

  if (search) {
    const q = String(search).toLowerCase();
    const like = `%${q}%`;
    where[Op.or] = [
      sqlWhere(fn('LOWER', col('name')), { [Op.like]: like }),
      sqlWhere(fn('LOWER', col('tax_number')), { [Op.like]: like }),
    ];
  }

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

async function createCompany(data, user) {
  return Company.create(data, { user });
}

async function updateCompany(id, data, user) {
  const company = await Company.findByPk(id);
  if (!company) return null;
  await company.update(data, { user });
  return company;
}

async function softDeleteCompany(id, user) {
  const company = await Company.findByPk(id);
  if (!company) return null;
  await company.update({ active: false }, { user });
  return company;
}

module.exports = {
  listCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  softDeleteCompany,
};
