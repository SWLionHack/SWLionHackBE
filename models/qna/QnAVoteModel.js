const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

const QnAVote = sequelize.define('QnAVote', {
  voteID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  qnaID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  voterID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = QnAVote;
