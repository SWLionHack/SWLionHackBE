// 채팅방에 참여하는 사람들을 관리하는 모델 
const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const MeetingChatRoom = require('./MeetingChatRoom');

const MeetingChatParticipant = sequelize.define('MeetingChatParticipant', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  meetingChatRoomId: {
    type: DataTypes.INTEGER,
    references: {
      model: MeetingChatRoom,
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'meeting_chat_participants',
  timestamps: false,
});

// MeetingChatRoom과 MeetingChatParticipant의 관계 설정
MeetingChatRoom.hasMany(MeetingChatParticipant, { foreignKey: 'meetingChatRoomId' });
MeetingChatParticipant.belongsTo(MeetingChatRoom, { foreignKey: 'meetingChatRoomId' });

module.exports = MeetingChatParticipant;


