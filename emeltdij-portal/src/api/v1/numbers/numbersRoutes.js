const express = require('express');

const { asyncHandler } = require('../../../middleware/asyncHandler');
const { requireAuth, requireAdmin } = require('../../../middleware/auth');
const { getNumbers, postNumber, putNumber, deleteNumber } = require('./numbersController');

const router = express.Router();

router.use(asyncHandler(requireAuth));

router.get('/', asyncHandler(getNumbers));
router.post('/', requireAdmin, asyncHandler(postNumber));
router.put('/:id', requireAdmin, asyncHandler(putNumber));
router.delete('/:id', requireAdmin, asyncHandler(deleteNumber));

module.exports = { numbersRouter: router };

