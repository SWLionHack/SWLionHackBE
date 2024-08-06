const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

const DailyQuestion = sequelize.define('DailyQuestion', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isShared: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  likes: { // 좋아요 수 추가
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  imagePath: { // 사진 경로 추가
    type: DataTypes.STRING,
    allowNull: true  // 필수 아니여서 true
  }
}, {
  tableName: 'daily_questions',
  timestamps: false
});

module.exports = DailyQuestion;
