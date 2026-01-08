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
      unique: true,
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
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'archived'),
      allowNull: false,
      defaultValue: 'active',
      field: 'status',
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
    tableName: 'premium_numbers',
    timestamps: true,
    indexes: [
      { fields: ['client_id'] },
      { fields: ['company_id'] },
      { fields: ['status'] },
    ],
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

module.exports = PremiumNumber;
