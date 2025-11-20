// src/routes/statusRoutes.js
const express = require('express');
const router = express.Router();

const statusController = require('../controllers/statusController');

// Gyökér útvonal: GET /
router.get('/', statusController.getRoot);

// Healthcheck: GET /health
router.get('/health', statusController.getHealth);

// Adatbázis healthcheck: GET /health/db
router.get('/health/db', statusController.getDbHealth);


module.exports = router;
