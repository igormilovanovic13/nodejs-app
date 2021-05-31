const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const NoteAndAdvice = sequelize.define('noteAndAdvice', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  note: {
    type: Sequelize.TEXT,
    allowNull: false,
  },
  picture1: Sequelize.STRING,
  picture2: Sequelize.STRING,
  picture3: Sequelize.STRING,
  picture4: Sequelize.STRING,
  picture5: Sequelize.STRING,
  picture6: Sequelize.STRING,
  picture7: Sequelize.STRING,
  picture8: Sequelize.STRING,
});

module.exports = NoteAndAdvice;
