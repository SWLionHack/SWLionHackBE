const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const MeetVote = require('./MeetVoteModel'); 
const User = require('../User'); // User 모델을 가져옵니다.

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
    references: {
      model: 'user', // Users 테이블과 연관
      key: 'id'
    }
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

Meet.belongsTo(User, { foreignKey: 'author', as: 'authorDetails' }); // User 모델과의 관계 설정
User.hasMany(Meet, { foreignKey: 'author' }); // User가 여러 Meet를 가질 수 있도록 설정

module.exports = Meet;
