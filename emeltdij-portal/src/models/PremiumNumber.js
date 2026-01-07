// src/models/PremiumNumber.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const PremiumNumber = sequelize.define(
  'PremiumNumber',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'number',
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'client_id',
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'company_id',
    },
    provider: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'provider',
    },
    pricingPlan: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'pricing_plan',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'active',
    },
  },
  {
    tableName: 'premium_numbers',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['company_id', 'number'],
      },
      { fields: ['client_id'] },
      { fields: ['company_id'] },
      { fields: ['active'] },
    ],
  }
);

module.exports = PremiumNumber;
