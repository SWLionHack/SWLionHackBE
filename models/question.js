// models/question.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

class Question extends Model {}

Question.init({
  surveyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'Question',
  tableName: 'survey_questions',
  timestamps: true
});

module.exports = Question;



