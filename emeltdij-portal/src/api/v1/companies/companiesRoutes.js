const express = require('express');

const { asyncHandler } = require('../../../middleware/asyncHandler');
const { requireAuth, requireAdmin } = require('../../../middleware/auth');
const {
  getCompanies,
  getCompany,
  postCompany,
  putCompany,
  deleteCompany,
} = require('./companiesController');

const router = express.Router();

router.use(asyncHandler(requireAuth));
router.use(requireAdmin);

router.get('/', asyncHandler(getCompanies));
router.get('/:id', asyncHandler(getCompany));
router.post('/', asyncHandler(postCompany));
router.put('/:id', asyncHandler(putCompany));
router.delete('/:id', asyncHandler(deleteCompany));

module.exports = { companiesRouter: router };
