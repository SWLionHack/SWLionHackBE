const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const User = require('../User');
const MentoringMessage = require('./Message'); // Message 모델 불러오기

const MentoringRoom = sequelize.define('MentoringRoom', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  menteeId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mentorId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  name: { // 방 이름 추가
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'mentoringrooms',
  timestamps: false
});

module.exports = MentoringRoom;