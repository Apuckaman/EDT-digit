const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');

const ImportRun = sequelize.define(
  'ImportRun',
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'type',
    },
    mode: {
      type: DataTypes.ENUM('dry-run', 'apply'),
      allowNull: false,
      field: 'mode',
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'username',
    },
    fileName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'file_name',
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'started_at',
    },
    finishedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'finished_at',
    },
    summary: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'summary',
    },
    rows: {
      type: DataTypes.JSON,
      allowNull: true,
      field: 'rows',
    },
  },
  {
    tableName: 'import_runs',
    timestamps: false,
    indexes: [{ fields: ['type'] }, { fields: ['mode'] }, { fields: ['username'] }],
  }
);

module.exports = ImportRun;

