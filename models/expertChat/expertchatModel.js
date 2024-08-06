const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

const ExpertChatRoom = sequelize.define('ExpertChatRoom', {
  chatId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expertId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'expert_chat_room',
  timestamps: true
});

module.exports = ExpertChatRoom;