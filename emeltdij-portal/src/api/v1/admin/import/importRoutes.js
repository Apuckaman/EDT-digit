const express = require('express');

const { asyncHandler } = require('../../../../middleware/asyncHandler');
const { requireAuth, requireAdmin } = require('../../../../middleware/auth');
const {
  premiumNumbersUploadMiddleware,
  importPremiumNumbers,
} = require('./importController');

const router = express.Router();

router.use(asyncHandler(requireAuth));
router.use(requireAdmin);

router.post(
  '/premium-numbers',
  premiumNumbersUploadMiddleware,
  asyncHandler(importPremiumNumbers)
);

module.exports = { importRouter: router };

