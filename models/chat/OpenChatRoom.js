const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

const OpenChatRoom = sequelize.define('OpenChatRoom', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'open_chat_rooms',
  timestamps: false
});

module.exports = OpenChatRoom;
