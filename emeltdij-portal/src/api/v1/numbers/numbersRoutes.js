const express = require('express');

const { asyncHandler } = require('../../../middleware/asyncHandler');
const { requireAuth, requireAdmin } = require('../../../middleware/auth');
const { getNumbers, postNumber, putNumber } = require('./numbersController');

const router = express.Router();

router.use(asyncHandler(requireAuth));
router.use(requireAdmin);

router.get('/', asyncHandler(getNumbers));
router.post('/', asyncHandler(postNumber));
router.put('/:id', asyncHandler(putNumber));

module.exports = { numbersRouter: router };

