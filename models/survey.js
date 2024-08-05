const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const SurveyResult = sequelize.define('SurveyResult', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'user', // Users 테이블과 연결
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  result: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'survey_results',
  timestamps: true
});

module.exports = SurveyResult;
