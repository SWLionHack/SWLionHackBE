const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  chatRoomId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'ChatRoom',
      key: 'id'
    }
  },
  senderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  senderType: {
    type: DataTypes.ENUM('user', 'expert'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'message',
  timestamps: false
});

module.exports = Message;
