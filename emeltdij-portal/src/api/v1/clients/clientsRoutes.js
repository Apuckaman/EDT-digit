const express = require('express');

const { asyncHandler } = require('../../../middleware/asyncHandler');
const { requireAuth, requireAdmin } = require('../../../middleware/auth');
const { getClients, postClient, putClient, deleteClient } = require('./clientsController');

const router = express.Router();

router.use(asyncHandler(requireAuth));

router.get('/', asyncHandler(getClients));
router.post('/', requireAdmin, asyncHandler(postClient));
router.put('/:id', requireAdmin, asyncHandler(putClient));
router.delete('/:id', requireAdmin, asyncHandler(deleteClient));

module.exports = { clientsRouter: router };
