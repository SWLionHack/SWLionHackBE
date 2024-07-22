require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const router = require('./routes/router');
const sequelize = require('./sequelize');  // sequelize 설정 파일 경로
const User = require('./models/User');  // User 모델 파일 경로
const bcrypt = require('bcrypt');  // 목업 데이터 암호화를 위한 bcrypt

const app = express();
const port = process.env.PORT || 3306;

const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: true });  // 데이터베이스 동기화 (force: true로 설정하여 기존 테이블을 삭제하고 다시 생성)
    console.log('Database synchronized');

    // 목업 데이터 삽입
    await User.bulkCreate([
      { name: 'Alice3', phone: '010-1111-1111', email: '123@gmail.com', password: await bcrypt.hash('123', 10),status:"자녀"},
      { name: 'Bob3', phone: '010-2222-2222', email: '456@gmail.com', password: await bcrypt.hash('456', 10),status:"부모" },
      { name: 'Charlie3', phone: '010-3333-3333', email: '789@gmail.com', password: await bcrypt.hash('789', 10),status:"자녀" },
    ]);
    
    console.log('Mock data inserted');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initializeApp();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'src', 'views'));


// 라우터 사용
app.use("/", router);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
