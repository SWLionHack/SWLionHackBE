const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

const MeetVote = sequelize.define('MeetVote', {
  voteID: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  meetID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  voterID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = MeetVote;
