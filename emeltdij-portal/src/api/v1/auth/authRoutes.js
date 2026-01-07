const express = require('express');

const { asyncHandler } = require('../../../middleware/asyncHandler');
const { login, logout, me } = require('./authController');

const router = express.Router();

router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/me', asyncHandler(me));

module.exports = { authRouter: router };

