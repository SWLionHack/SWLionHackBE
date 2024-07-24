const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // sequelize 설정 파일 경로

const Diary = sequelize.define('Diary', {
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
    allowNull: false
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
  tableName: 'diaries',
  timestamps: false
});

module.exports = Diary;
