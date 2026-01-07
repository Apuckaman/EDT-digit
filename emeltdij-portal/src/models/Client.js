// src/models/Client.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const Client = sequelize.define(
  'Client',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'code',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    billingAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'billing_address',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'phone',
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'company_id',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'active',
    },
  },
  {
    tableName: 'clients',
    timestamps: true,
  }
);

module.exports = Client;
