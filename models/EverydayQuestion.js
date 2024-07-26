const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const EverydayQuestion = sequelize.define('EverydayQuestion', {
  question: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'everyday_questions',
  timestamps: false
});

module.exports = EverydayQuestion;
