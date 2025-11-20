// src/seed/seedCompanies.js
const { sequelize } = require('../db');
const Company = require('../models/Company');

async function seedCompanies() {
  try {
    // Tábla létrehozása, ha nem létezik
    await sequelize.sync();

    // Cégek felvétele, ha még nincsenek
    const companiesData = [
      {
        name: 'Ween Bt.',
        taxNumber: '25145940-1-02',
        vatStatus: 'afamentes',
      },
      {
        name: 'SwiftGate Bt.',
        taxNumber: '25742561-2-42',
        vatStatus: 'afas',
      },
    ];

    for (const data of companiesData) {
      const [company, created] = await Company.findOrCreate({
        where: { taxNumber: data.taxNumber },
        defaults: data,
      });

      console.log(
        `${created ? 'Létrehozva' : 'Már létezett'}: ${company.name} (${company.taxNumber})`
      );
    }

    console.log('Cég seedelés kész.');
  } catch (error) {
    console.error('Hiba a cég seedelés során:', error);
  } finally {
    await sequelize.close();
    console.log('Adatbázis kapcsolat lezárva.');
  }
}

seedCompanies();
