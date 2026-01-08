// src/seed/seedNumbers.js
const { sequelize } = require('../db');
const { Company, Client, PremiumNumber } = require('../models');

async function seedNumbers() {
  try {
    await sequelize.sync();

    const ween = await Company.findOne({ where: { taxNumber: '25145940-1-02' } });
    const swift = await Company.findOne({ where: { taxNumber: '25742561-2-42' } });

    const client1 = await Client.findOne({ where: { name: 'Teszt Ügyfél 1' } });
    const client2 = await Client.findOne({ where: { name: 'Teszt Ügyfél 2' } });

    const numbersData = [
      {
        number: '0690-111-1111',
        clientId: client1.id,
        companyId: ween.id,
        provider: 'Telekom',
        pricingPlan: 'Alap díjcsomag',
      },
      {
        number: '0690-222-2222',
        clientId: client1.id,
        companyId: ween.id,
        provider: 'Telekom',
        pricingPlan: 'Prémium díjcsomag',
      },
      {
        number: '0690-333-3333',
        clientId: client2.id,
        companyId: swift.id,
        provider: 'Vodafone',
        pricingPlan: 'Alap díjcsomag',
      },
    ];

    for (const data of numbersData) {
      const [number, created] = await PremiumNumber.findOrCreate({
        where: { number: data.number },
        defaults: data,
      });

      console.log(
        `${created ? 'Létrehozva' : 'Már létezett'}: ${number.number} (clientId: ${number.clientId}, companyId: ${number.companyId})`
      );
    }

    console.log('Prémium szám seedelés kész.');
  } catch (error) {
    console.error('Hiba a prémium szám seedelés során:', error);
  } finally {
    await sequelize.close();
    console.log('Adatbázis kapcsolat lezárva.');
  }
}

seedNumbers();
