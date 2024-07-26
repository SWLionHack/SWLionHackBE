require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const dailyQuestionRouter = require('./routes/dailyQuestionRouter');
const everydayQuestionRouter = require('./routes/everydayQuestionRouter');
const dailyQuestionBoardRouter = require('./routes/dailyQuestionBoardRouter');
const sequelize = require('./sequelize');
const User = require('./models/User');
const postModel = require('./models/postModel.js');
const DailyQuestion = require('./models/DailyQuestion');
const EverydayQuestion = require('./models/EverydayQuestion');
const DailyQuestionBoard = require('./models/DailyQuestionBoard');
const { getTest } = require('./test/testRepository.js');
const schedule = require('node-schedule');

const app = express();
const port = process.env.PORT || 8181;
const corsOrigins = [process.env.CORS_ORIGIN || 'http://localhost', 'http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// 매일 오후 0시에 게시판 초기화
schedule.scheduleJob('0 0 * * *', async () => {
  try {
    await DailyQuestionBoard.destroy({ where: {} });
    console.log('DailyQuestionBoard has been reset');
  } catch (err) {
    console.error('Failed to reset DailyQuestionBoard:', err);
  }
});

// 매일 오전 8시에 새로운 질문 
schedule.scheduleJob('0 8 * * *', async () => {
  const t = await sequelize.transaction();
  try {
    const questions = await EverydayQuestion.findAll({
      order: [['order', 'ASC']],
      transaction: t
    });

    if (questions.length > 0) {
      const firstQuestion = questions[0];
      const nextOrder = firstQuestion.order === questions.length ? 1 : firstQuestion.order + 1;
      const nextQuestion = questions.find(q => q.order === nextOrder);

      // Update the order of the first question to the highest order
      await EverydayQuestion.update(
        { order: questions.length + 1 },
        { where: { id: firstQuestion.id }, transaction: t }
      );

      // Update the order of the remaining questions
      for (let i = 1; i < questions.length; i++) {
        await EverydayQuestion.update(
          { order: i },
          { where: { id: questions[i].id }, transaction: t }
        );
      }

      // Update the first question's order to the highest value in sequence
      await EverydayQuestion.update(
        { order: questions.length },
        { where: { id: firstQuestion.id }, transaction: t }
      );

      await t.commit();
      console.log('New everyday question set:', nextQuestion.question);
    }
  } catch (err) {
    await t.rollback();
    console.error('Failed to set everyday question:', err);
  }
});

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

    await EverydayQuestion.bulkCreate([
      { question: 'What is your plan for today?', order: 1 },
      { question: 'What did you learn today?', order: 2 },
      { question: 'What made you happy today?', order: 3 }
    ]);

    console.log('Mock data inserted');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initializeApp();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'src', 'views'));

app.use("/", userRouter);
app.use("/", postRouter);
app.use("/", dailyQuestionRouter);
app.use("/", everydayQuestionRouter);
app.use("/", dailyQuestionBoardRouter);

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
