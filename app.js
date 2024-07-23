require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const router = require('./routes/router');
const sequelize = require('./sequelize');
const User = require('./models/User');
const { getTest } = require('./test/testRepository.js');

const app = express();
const port = process.env.PORT || 8181;
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost';

app.use(cors({
  origin: corsOrigin,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
}));

app.use(bodyParser.json()); // JSON 요청 본문 파싱 설정
app.use(bodyParser.urlencoded({ extended: true }));

const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    await User.bulkCreate([
      { name: 'Alice3', phone: '010-1111-1111', email: '123@gmail.com', password: await bcrypt.hash('123', 10), status: "자녀" },
      { name: 'Bob3', phone: '010-2222-2222', email: '456@gmail.com', password: await bcrypt.hash('456', 10), status: "부모" },
      { name: 'Charlie3', phone: '010-3333-3333', email: '789@gmail.com', password: await bcrypt.hash('789', 10), status: "자녀" },
    ]);

    console.log('Mock data inserted');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initializeApp();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'src', 'views'));

app.use("/", router);

app.get('/test', async (req, res) => {
  try {
    const data = await getTest();
    res.json({ message: 'Hello, Express!, end point /test', data });
  } catch (err) {
    res.status(500).json({ message: 'Database Error', error: err.message });
  }
});

app.get('/api', (req, res) => {
  res.json({ message: 'Hello, Express!, end point /api' });
});

app.listen(port, () => {
  console.log(`Server running on :${port}`);
});
