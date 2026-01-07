const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Company = sequelize.define(
  'Company',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    taxNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'tax_number',
    },
    type: {
      type: DataTypes.ENUM('AFAS', 'AFAMENTES'),
      allowNull: false,
      field: 'type',
    },
    bankAccount: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'bank_account',
    },
    szamlazzApiKey: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'szamlazz_api_key',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'active',
    },
  },
  {
    tableName: 'companies',
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = Company;
