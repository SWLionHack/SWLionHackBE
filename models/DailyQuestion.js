const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const DailyQuestion = sequelize.define('DailyQuestion', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'daily_questions',
  timestamps: false
});

module.exports = DailyQuestion;
