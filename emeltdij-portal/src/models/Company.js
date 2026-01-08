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
      unique: true,
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
    createdBy: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'system',
      field: 'created_by',
    },
    updatedBy: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'system',
      field: 'updated_by',
    },
  },
  {
    tableName: 'companies',
    timestamps: true, // createdAt, updatedAt
    hooks: {
      beforeCreate(instance, options) {
        const actor =
          (options && options.user && options.user.username) ||
          (options && options.user && options.user.id) ||
          (options && options.user) ||
          null;
        if (actor) {
          if (!instance.createdBy) instance.createdBy = String(actor);
          instance.updatedBy = String(actor);
        }
      },
      beforeUpdate(instance, options) {
        const actor =
          (options && options.user && options.user.username) ||
          (options && options.user && options.user.id) ||
          (options && options.user) ||
          null;
        if (actor) {
          instance.updatedBy = String(actor);
        }
      },
    },
  }
);

module.exports = Company;
