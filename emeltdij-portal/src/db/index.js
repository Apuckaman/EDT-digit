// src/db/index.js
const { Sequelize } = require('sequelize');

// SQLite adatbázis beállítása
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite', // ez a fájl az emeltdij-portal gyökérben fog létrejönni
  logging: false, // kapcsoljuk ki a fölösleges logokat
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
