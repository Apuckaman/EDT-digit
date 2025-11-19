const express = require('express');
const app = express();

// Itt lesznek majd az API végpontok
app.get('/', (req, res) => {
  res.send('EDT digit – Emeltdíjas Portál backend működik 🚀');
});

// Egyszerű „healthcheck”, hogy él-e a szerver
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'emeltdij-portal', time: new Date().toISOString() });
});

module.exports = app;
