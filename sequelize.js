const { Sequelize } = require('sequelize');

// 환경변수에서 데이터베이스 연결 정보 가져오기
const sequelize = new Sequelize(process.env.DBDATABASE, process.env.DBUSER, process.env.DBPASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

module.exports = sequelize;
