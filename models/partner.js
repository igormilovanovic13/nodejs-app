const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Partner = sequelize.define('mypartner', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  PIB: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  ime: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  adresa: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  postanskibroj: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  grad: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
  },
});

module.exports = Partner;
