const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const User = require('../User');
const DailyQuestion = require('./DailyQuestion');

const DailyQuestionLike = sequelize.define('DailyQuestionLike', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: DailyQuestion,
      key: 'id'
    }
  }
}, {
  tableName: 'daily_question_likes',
  timestamps: false,
  uniqueKeys: {
    unique_user_question: {
      fields: ['userId', 'questionId']
    }
  }
});

module.exports = DailyQuestionLike;
