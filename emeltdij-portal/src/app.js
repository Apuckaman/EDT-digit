// src/app.js
const express = require('express');
const app = express();

// JSON body-khoz (később jól fog jönni)
app.use(express.json());

// Modellek és relációk betöltése (side-effect)
require('./models');

// Status route-ok betöltése
const statusRoutes = require('./routes/statusRoutes');
app.use('/', statusRoutes);

// Company route-ok
const companyRoutes = require('./routes/companyRoutes');
app.use('/', companyRoutes);

// Client route-ok
const clientRoutes = require('./routes/clientRoutes');
app.use('/', clientRoutes);

// Premium number route-ok
const numberRoutes = require('./routes/numberRoutes');
app.use('/', numberRoutes);

module.exports = app;
