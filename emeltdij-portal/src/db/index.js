// src/db/index.js
require('dotenv').config();

const { Sequelize } = require('sequelize');

const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
const DB_NAME = process.env.DB_NAME || 'emeltdij_portal';
const DB_USER = process.env.DB_USER || 'emeltdij';
const DB_PASSWORD = process.env.DB_PASSWORD || 'emeltdij_password';
const DB_LOGGING = process.env.DB_LOGGING === 'true';

// MySQL adatbázis beállítása (V1 standard)
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: DB_LOGGING ? console.log : false,
  define: {
    underscored: true,
  },
});

// Egyszerű kapcsolódási teszt
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Adatbázis kapcsolat: OK');
    return true;
  } catch (error) {
    console.error('Adatbázis kapcsolat HIBA:', error);
    return false;
  }
}

module.exports = {
  sequelize,
  testConnection,
};
