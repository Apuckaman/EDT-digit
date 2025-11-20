// src/controllers/statusController.js

const { testConnection } = require('../db');


// Főoldal (egyszerű szöveges válasz)
function getRoot(req, res) {
  res.send('EDT digit – Emeltdíjas Portál backend működik 🚀');
}

// Healthcheck endpoint (JSON)
function getHealth(req, res) {
  res.json({
    status: 'ok',
    service: 'emeltdij-portal',
    time: new Date().toISOString(),
  });
}

// Adatbázis healthcheck
async function getDbHealth(req, res) {
  const ok = await testConnection();

  res.json({
    status: 'ok',
    service: 'emeltdij-portal',
    db: ok ? 'ok' : 'error',
    time: new Date().toISOString(),
  });
}

module.exports = {
  getRoot,
  getHealth,
  getDbHealth,
};

