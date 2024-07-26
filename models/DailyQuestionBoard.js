const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const DailyQuestion = require('./DailyQuestion');
const User = require('./User');

const DailyQuestionBoard = sequelize.define('DailyQuestionBoard', {
  dailyQuestionId: {
    type: DataTypes.INTEGER,
    references: {
      model: DailyQuestion,
      key: 'id'
    },
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id'
    },
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likedUsers: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'daily_question_board',
  timestamps: true
});

DailyQuestion.hasOne(DailyQuestionBoard, { foreignKey: 'dailyQuestionId' });
DailyQuestionBoard.belongsTo(DailyQuestion, { foreignKey: 'dailyQuestionId' });

module.exports = DailyQuestionBoard;
