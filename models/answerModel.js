const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // sequelize 설정 파일 경로

const Answer = sequelize.define('Answer', {
  answerID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  questionID: {
    type: DataTypes.INTEGER,
    allowNull:false
  },
  author: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'anwers',
  timestamps: false
});

module.exports = Answer;