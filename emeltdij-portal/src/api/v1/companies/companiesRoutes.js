const express = require('express');

const { asyncHandler } = require('../../../middleware/asyncHandler');
const {
  getCompanies,
  postCompany,
  putCompany,
} = require('./companiesController');

const router = express.Router();

router.get('/', asyncHandler(getCompanies));
router.post('/', asyncHandler(postCompany));
router.put('/:id', asyncHandler(putCompany));

module.exports = { companiesRouter: router };
