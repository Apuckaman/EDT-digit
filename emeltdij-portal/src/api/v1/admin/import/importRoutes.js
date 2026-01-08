const express = require('express');

const { asyncHandler } = require('../../../../middleware/asyncHandler');
const { requireAuth, requireAdmin } = require('../../../../middleware/auth');
const {
  premiumNumbersUploadMiddleware,
  importPremiumNumbers,
} = require('./importController');
const { listImportRuns, getImportRun } = require('./importRunsController');

const router = express.Router();

router.use(asyncHandler(requireAuth));
router.use(requireAdmin);

router.post(
  '/premium-numbers',
  premiumNumbersUploadMiddleware,
  asyncHandler(importPremiumNumbers)
);

// S6-06: import run lista + detail (read-only)
router.get('/runs', asyncHandler(listImportRuns));
router.get('/runs/:id', asyncHandler(getImportRun));

module.exports = { importRouter: router };

