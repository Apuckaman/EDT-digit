const bcrypt = require('bcryptjs');

const { sequelize } = require('../db');
const { User } = require('../models');

async function seedAdmin() {
  try {
    await sequelize.sync();

    const username = process.env.SEED_ADMIN_USERNAME || 'admin';
    const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const passwordHash = await bcrypt.hash(password, 10);

    const [user, created] = await User.findOrCreate({
      where: { username },
      defaults: {
        username,
        passwordHash,
        role: 'ADMIN',
        clientId: null,
        active: true,
      },
    });

    if (!created) {
      await user.update({
        passwordHash,
        role: 'ADMIN',
        clientId: null,
        active: true,
      });
    }

    console.log(`${created ? 'Létrehozva' : 'Frissítve'}: admin user (${username})`);
  } catch (error) {
    console.error('Hiba az admin seed során:', error);
  } finally {
    await sequelize.close();
    console.log('Adatbázis kapcsolat lezárva.');
  }
}

seedAdmin();

