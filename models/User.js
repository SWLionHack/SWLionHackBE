const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // sequelize 설정 파일 경로

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  birthdate: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'user',
  timestamps: false
});

module.exports = User;
