const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const OpenChatRoom = require('./OpenChatRoom');

const OpenChatMessage = sequelize.define('OpenChatMessage', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  openChatRoomId: {
    type: DataTypes.INTEGER,
    references: {
      model: OpenChatRoom,
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
  tableName: 'open_chat_messages',
  timestamps: false
});

OpenChatRoom.hasMany(OpenChatMessage, { foreignKey: 'openChatRoomId' });
OpenChatMessage.belongsTo(OpenChatRoom, { foreignKey: 'openChatRoomId' });

module.exports = OpenChatMessage;
