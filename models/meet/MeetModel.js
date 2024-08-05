const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const MeetVote = require('./MeetVoteModel'); 

const Meet = sequelize.define('Meet', {
  meetID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  expirationTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  author: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  maxCapacity: {
    type: DataTypes.INTEGER, 
    allowNull: false,
    defaultValue: 1, // 자신의 글 참가 방지하고 1로 할 예정 
  }
});

// 모델 간의 관계를 정의합니다.
Meet.hasMany(MeetVote, { foreignKey: 'meetID', as: 'votes' }); 
MeetVote.belongsTo(Meet, { foreignKey: 'meetID', as: 'meet' }); 

module.exports = Meet;
