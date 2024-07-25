const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const User = require('../User');
const Expert = require('../Expert');
const Message = require('./Message'); // Message 모델 불러오기

const ChatRoom = sequelize.define('ChatRoom', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  expertId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Expert,
      key: 'id'
    }
  },
  name: { // 방 이름 추가
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'chatroom',
  timestamps: false
});

// ChatRoom과 Message 간의 관계 설정
ChatRoom.hasMany(Message, { foreignKey: 'chatRoomId' });
Message.belongsTo(ChatRoom, { foreignKey: 'chatRoomId' });

module.exports = ChatRoom;
