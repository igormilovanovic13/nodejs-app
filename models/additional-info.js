const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const AdditionalInfo = sequelize.define('additionalinfo', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  fizickaOstecenja: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  prljavaZamascena: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  stanjeStubica: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preNapon: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  preNapunjenost: {
    type: Sequelize.DOUBLE,
  },
  preGustCel1: {
    type: Sequelize.DOUBLE,
  },
  preNivoElCel1: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preZamucenaCel1: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preGustCel2: {
    type: Sequelize.DOUBLE,
  },
  preNivoElCel2: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preZamucenaCel2: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preGustCel3: {
    type: Sequelize.DOUBLE,
  },
  preNivoElCel3: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preZamucenaCel3: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preGustCel4: {
    type: Sequelize.DOUBLE,
  },
  preNivoElCel4: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preZamucenaCel4: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preGustCel5: {
    type: Sequelize.DOUBLE,
  },
  preNivoElCel5: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preZamucenaCel5: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preGustCel6: {
    type: Sequelize.DOUBLE,
  },
  preNivoElCel6: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  preZamucenaCel6: {
    type: Sequelize.STRING,
    allowNull: false,
  },  
});

module.exports = AdditionalInfo;
