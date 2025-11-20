// src/routes/companyRoutes.js
const express = require('express');
const router = express.Router();

const companyController = require('../controllers/companyController');

// GET /companies
router.get('/companies', companyController.getCompanies);

module.exports = router;
