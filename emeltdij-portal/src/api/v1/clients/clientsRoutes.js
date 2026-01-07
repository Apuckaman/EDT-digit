const express = require('express');

const { asyncHandler } = require('../../../middleware/asyncHandler');
const { requireAuth, requireAdmin } = require('../../../middleware/auth');
const { getClients, postClient, putClient } = require('./clientsController');

const router = express.Router();

router.use(asyncHandler(requireAuth));
router.use(requireAdmin);

router.get('/', asyncHandler(getClients));
router.post('/', asyncHandler(postClient));
router.put('/:id', asyncHandler(putClient));

module.exports = { clientsRouter: router };
