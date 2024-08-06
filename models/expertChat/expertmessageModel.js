const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

const ExpertChatMessage = sequelize.define('ExpertChatMessage', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    expertChatRoomId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    senderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  }, {
    tableName: 'expert_chat_message',
    timestamps: true
  });
  
  module.exports = ExpertChatMessage;  