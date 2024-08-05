const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./User'); // User 모델을 가져옵니다.

const Diary = sequelize.define('Diary', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  summary: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  author: { 
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'diaries',
  timestamps: false
});

User.hasMany(Diary, { foreignKey: 'author' });
Diary.belongsTo(User, { foreignKey: 'author' });

module.exports = Diary;
