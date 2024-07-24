const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize'); // sequelize 설정 파일 경로

const Answer = sequelize.define('Comment', {
  commentID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  postID: {
    type: DataTypes.INTEGER,
    allowNull:false
  },
  author: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
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
  tableName: 'comments',
  timestamps: false
});

module.exports = Comment;