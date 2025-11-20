// src/controllers/clientController.js
const Client = require('../models/Client');
const Company = require('../models/Company');

// GET /clients
async function getClients(req, res) {
  try {
    const clients = await Client.findAll({
      include: [
        {
          model: Company,
          attributes: ['id', 'name', 'taxNumber', 'vatStatus'],
        },
      ],
    });

    res.json(clients);
  } catch (error) {
    console.error('Hiba a kliensek lekérdezésekor:', error);
    res.status(500).json({ error: 'Hiba történt az ügyfelek lekérdezése során.' });
  }
}

module.exports = {
  getClients,
};
