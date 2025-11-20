// src/syncDb.js
const { sequelize } = require('./db');
require('./models'); // betölti Company, Client, PremiumNumber és a relációkat

async function syncDb() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Adatbázis struktúra szinkronizálva.');
  } catch (error) {
    console.error('Hiba a DB szinkronizálás során:', error);
  } finally {
    await sequelize.close();
    console.log('Adatbázis kapcsolat lezárva.');
  }
}

syncDb();
