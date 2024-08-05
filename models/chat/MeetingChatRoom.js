const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

const MeetingChatRoom = sequelize.define('MeetingChatRoom', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'meeting_chat_rooms',
  timestamps: false
});

module.exports = MeetingChatRoom;
