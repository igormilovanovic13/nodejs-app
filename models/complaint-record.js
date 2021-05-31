const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Record = sequelize.define('record', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  datumPrijema: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  brojPrijema: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  datumZapisnika: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  brojZapisnika: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tipAkumulatora: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  brojAkumulatora: Sequelize.STRING,
  brojRacuna: Sequelize.STRING,
  tipVozila: Sequelize.STRING,
  status: {
    type: Sequelize.ENUM,
    values: ['unverified', 'verified', 'finished'],
    defaultValue: 'unverified',
  },
  decision: {
    type: Sequelize.ENUM,
    values: ['denied', 'accepted'],
    defaultValue: 'denied',
  },
});

module.exports = Record;
