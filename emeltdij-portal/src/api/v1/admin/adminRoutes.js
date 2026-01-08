const express = require('express');

const { asyncHandler } = require('../../../middleware/asyncHandler');
const { requireAuth, requireAdmin } = require('../../../middleware/auth');
const { getCompanyOverview } = require('./adminController');

const router = express.Router();

router.use(asyncHandler(requireAuth));
router.use(requireAdmin);

router.get('/companies/:id/overview', asyncHandler(getCompanyOverview));

module.exports = { adminRouter: router };

