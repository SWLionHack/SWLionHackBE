const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const QnAVote = require('./QnAVoteModel'); // QnAVote 모델을 올바르게 불러옵니다.

const QnA = sequelize.define('QnA', {
  qnaID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  expirationTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  author: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

// 모델 간의 관계를 정의합니다.
QnA.hasMany(QnAVote, { foreignKey: 'qnaID', as: 'votes' });
QnAVote.belongsTo(QnA, { foreignKey: 'qnaID', as: 'qna' });

module.exports = QnA;
