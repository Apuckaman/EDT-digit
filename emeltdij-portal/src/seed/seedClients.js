// src/seed/seedClients.js
const { sequelize } = require('../db');
const { Company, Client } = require('../models');

async function seedClients() {
  try {
    await sequelize.sync();

    const ween = await Company.findOne({ where: { taxNumber: '25145940-1-02' } });
    const swift = await Company.findOne({ where: { taxNumber: '25742561-2-42' } });

    const clientsData = [
      {
        code: 'UGYF001',
        name: 'Teszt Ügyfél 1',
        email: 'ugyfel1@example.com',
        billingAddress: '1111 Budapest, Teszt utca 1.',
        phone: '+36-30-111-1111',
        companyId: ween.id,
      },
      {
        code: 'UGYF002',
        name: 'Teszt Ügyfél 2',
        email: 'ugyfel2@example.com',
        billingAddress: '2222 Budapest, Másik utca 2.',
        phone: '+36-30-222-2222',
        companyId: swift.id,
      },
    ];

    for (const data of clientsData) {
      const [client, created] = await Client.findOrCreate({
        where: { code: data.code },
        defaults: data,
      });

      console.log(
        `${created ? 'Létrehozva' : 'Már létezett'}: ${client.name} (companyId: ${client.companyId})`
      );
    }

    console.log('Ügyfél seedelés kész.');
  } catch (error) {
    console.error('Hiba az ügyfél seedelés során:', error);
  } finally {
    await sequelize.close();
    console.log('Adatbázis kapcsolat lezárva.');
  }
}

seedClients();
