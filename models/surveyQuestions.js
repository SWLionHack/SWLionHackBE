// models/question.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

class Survey_Questions extends Model {}

Survey_Questions.init({
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
  modelName: 'Survey_Questions',
  tableName: 'survey_questions',
  timestamps: true
});

module.exports = Survey_Questions;



