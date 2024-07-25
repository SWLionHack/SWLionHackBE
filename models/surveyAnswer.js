

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');  // sequelize 인스턴스를 불러옵니다.

class SurveyAnswer extends Model {}

SurveyAnswer.init({
  surveyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  sequelize,  // sequelize 인스턴스를 전달합니다.
  modelName: 'SurveyAnswer',  // 모델 이름을 설정합니다.
  tableName: 'survey_answer',  // 테이블 이름을 설정합니다.
  timestamps: false,  // timestamps 설정을 false로 설정합니다.
});

module.exports = SurveyAnswer;





/*const { Model, DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const SurveyData = sequelize.define('survey_answer', {
  surveyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  questionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  answer: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'survey_data',
  timestamps: false,
});

module.exports = SurveyData;
*/
