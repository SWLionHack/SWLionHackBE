const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

const Expert = sequelize.define('Expert', {
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
  status: {  //expert
    type: DataTypes.STRING,
    allowNull: false
  },
  birthdate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  place:{
    type: DataTypes.TEXT,
    allowNull: false
  },
  introduce:{
    type: DataTypes.TEXT,
    allowNull: false
  }

}, {
  tableName: 'expert',
  timestamps: false
});

module.exports = Expert;