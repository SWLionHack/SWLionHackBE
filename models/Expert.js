const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Expert = sequelize.define('Expert', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
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
  specialization: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'expert',
  timestamps: false
});

module.exports = Expert;
