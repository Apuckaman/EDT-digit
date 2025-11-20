// src/models/Company.js
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
    },
    vatStatus: {
      type: DataTypes.STRING, // pl. 'afas' vagy 'afamentes'
      allowNull: false,
    },
  },
  {
    tableName: 'companies',
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = Company;
