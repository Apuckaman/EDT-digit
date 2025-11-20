// src/controllers/numberController.js
const PremiumNumber = require('../models/PremiumNumber');
const Client = require('../models/Client');
const Company = require('../models/Company');

// GET /numbers
async function getNumbers(req, res) {
  try {
    const numbers = await PremiumNumber.findAll({
      include: [
        {
          model: Client,
          attributes: ['id', 'name', 'email', 'billingAddress'],
        },
        {
          model: Company,
          attributes: ['id', 'name', 'taxNumber', 'vatStatus'],
        },
      ],
    });

    res.json(numbers);
  } catch (error) {
    console.error('Hiba a prémium számok lekérdezésekor:', error);
    res.status(500).json({ error: 'Hiba történt a prémium számok lekérdezése során.' });
  }
}

module.exports = {
  getNumbers,
};
