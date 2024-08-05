const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const MeetingChatRoom = require('./MeetingChatRoom');

const MeetingChatMessage = sequelize.define('MeetingChatMessage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  meetingChatRoomId: {
    type: DataTypes.INTEGER,
    references: {
      model: MeetingChatRoom,
      key: 'id'
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  },
  senderId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  senderType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'meeting_chat_messages',
  timestamps: false
});

// MeetingChatRoom과 MeetingChatMessage의 관계 설정
MeetingChatRoom.hasMany(MeetingChatMessage, { foreignKey: 'meetingChatRoomId' });
MeetingChatMessage.belongsTo(MeetingChatRoom, { foreignKey: 'meetingChatRoomId' });

module.exports = MeetingChatMessage;
