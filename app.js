const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 환경 변수 로드
dotenv.config();

const app = express();
const port = process.env.PORT || 8181;
const corsOrigins = [process.env.CORS_ORIGIN || 'http://localhost', 'http://localhost:3000']; // CORS 허용 origin 배열

// CORS 설정
app.use(cors({
  origin: function (origin, callback) {
    // CORS 허용 origin 배열에 요청 origin이 있는지 확인
    if (corsOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

const { getTest } = require('./test/testRepository.js');

app.get('/test', async (req, res) => { // req를 추가했습니다.
  try {
    const data = await getTest();
    res.json({ message: 'Hello, Express!, end point /test', data: data });
  } catch (err) {
    res.status(500).json({ message: 'Database Error', error: err.message }); // 상태 코드 추가
  }
});

app.get('/api', (req, res) => {
  res.json({ message: 'Hello, Express!, end point /api' });
});

app.listen(port, () => {
  console.log(`Server running on :${port}`);
});
