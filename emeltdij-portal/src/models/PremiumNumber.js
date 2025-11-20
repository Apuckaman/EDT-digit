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
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'premium_numbers',
    timestamps: true,
  }
);

module.exports = PremiumNumber;
