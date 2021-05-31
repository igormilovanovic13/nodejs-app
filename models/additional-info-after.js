const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const AdditionalInfoAfter = sequelize.define('additionalinfoafter', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  posleNapon: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  posleNapunjenost: {
    type: Sequelize.DOUBLE,
  },
  posleGustCel1: {
    type: Sequelize.DOUBLE,
  },
  posleNivoElCel1: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  posleZamucenaCel1: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  posleGustCel2: {
    type: Sequelize.DOUBLE,
  },
  posleNivoElCel2: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  posleZamucenaCel2: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  posleGustCel3: {
    type: Sequelize.DOUBLE,
  },
  posleNivoElCel3: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  posleZamucenaCel3: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  posleGustCel4: {
    type: Sequelize.DOUBLE,
  },
  posleNivoElCel4: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  posleZamucenaCel4: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  posleGustCel5: {
    type: Sequelize.DOUBLE,
  },
  posleNivoElCel5: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  posleZamucenaCel5: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  posleGustCel6: {
    type: Sequelize.DOUBLE,
  },
  posleNivoElCel6: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  posleZamucenaCel6: {
    type: Sequelize.STRING,
    allowNull: false,
  },  
});

module.exports = AdditionalInfoAfter;
