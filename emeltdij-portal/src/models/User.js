const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: 'username',
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
    },
    role: {
      type: DataTypes.ENUM('ADMIN', 'UGYFEL'),
      allowNull: false,
      field: 'role',
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'client_id',
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: 'active',
    },
  },
  {
    tableName: 'users',
    timestamps: false,
    indexes: [{ fields: ['role'] }, { fields: ['active'] }, { fields: ['client_id'] }],
  }
);

module.exports = User;

