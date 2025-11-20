// src/routes/numberRoutes.js
const express = require('express');
const router = express.Router();

const numberController = require('../controllers/numberController');

// GET /numbers
router.get('/numbers', numberController.getNumbers);

module.exports = router;
