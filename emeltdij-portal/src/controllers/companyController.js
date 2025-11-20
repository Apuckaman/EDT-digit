// src/controllers/companyController.js
const Company = require('../models/Company');

// GET /companies
async function getCompanies(req, res) {
  try {
    const companies = await Company.findAll();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Hiba történt a cégek lekérdezése során.' });
  }
}

module.exports = {
  getCompanies,
};
