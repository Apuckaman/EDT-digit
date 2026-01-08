const { ApiError } = require('../../../errors/ApiError');
const Company = require('../../../models/Company');
const Client = require('../../../models/Client');
const PremiumNumber = require('../../../models/PremiumNumber');

async function getCompanyOverview(req, res) {
  const id = parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) {
    throw ApiError.badRequest('VALIDATION_ERROR', 'Invalid company id', {
      id: 'Must be an integer',
    });
  }

  const company = await Company.findByPk(id);
  if (!company) throw ApiError.notFound('Company not found', { id });

  const clients = await Client.findAll({
    where: { companyId: id },
    order: [['createdAt', 'DESC']],
  });

  const numbers = await PremiumNumber.findAll({
    where: { companyId: id },
    order: [['createdAt', 'DESC']],
  });

  res.json({
    company,
    clients,
    numbers,
  });
}

module.exports = {
  getCompanyOverview,
};

