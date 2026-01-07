// src/models/index.js
const Company = require('./Company');
const Client = require('./Client');
const PremiumNumber = require('./PremiumNumber');
const User = require('./User');

// Company – Client
Company.hasMany(Client, { foreignKey: 'companyId' });
Client.belongsTo(Company, { foreignKey: 'companyId' });

// Client – PremiumNumber
Client.hasMany(PremiumNumber, { foreignKey: 'clientId' });
PremiumNumber.belongsTo(Client, { foreignKey: 'clientId' });

// Company – PremiumNumber
Company.hasMany(PremiumNumber, { foreignKey: 'companyId' });
PremiumNumber.belongsTo(Company, { foreignKey: 'companyId' });

// Client – User (UGYFEL user)
Client.hasMany(User, { foreignKey: 'clientId' });
User.belongsTo(Client, { foreignKey: 'clientId' });

module.exports = {
  Company,
  Client,
  PremiumNumber,
  User,
};
