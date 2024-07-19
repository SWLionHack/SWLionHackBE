const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 환경 변수 로드
dotenv.config();

const app = express();
const port = process.env.PORT || 8181;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost';

// CORS 설정
app.use(cors({
  origin: corsOrigin,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

app.get('/', (req, res) => {
  res.send('Hello, Express!, end point /');
});

app.get('/api', (req, res) => {
  res.send('Hello, Express!, end point /api');
});


app.listen(port, () => {
  console.log(`Server running on :${port}`);
});
