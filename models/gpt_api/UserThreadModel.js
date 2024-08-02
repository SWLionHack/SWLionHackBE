const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

// UserThread 모델 정의
const UserThread = sequelize.define('UserThread', {
    userID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    threadID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    assistantID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    }
  });
  
  module.exports = UserThread;