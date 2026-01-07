const express = require('express');

const { asyncHandler } = require('../../../middleware/asyncHandler');
const { getClients, postClient, putClient } = require('./clientsController');

const router = express.Router();

router.get('/', asyncHandler(getClients));
router.post('/', asyncHandler(postClient));
router.put('/:id', asyncHandler(putClient));

module.exports = { clientsRouter: router };
