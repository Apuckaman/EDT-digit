// src/routes/clientRoutes.js
const express = require('express');
const router = express.Router();

const clientController = require('../controllers/clientController');

// GET /clients
router.get('/clients', clientController.getClients);

module.exports = router;
