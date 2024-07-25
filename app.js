require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const router = require('./routes/router');
const postRouter = require('./routes/postRouter');
const questionRouter = require('./routes/questionRouter.js');
const commentRouter = require('./routes/commentRouter');
const answerRouter = require('./routes/answerRouter.js');
const sequelize = require('./sequelize');
const User = require('./models/User');
const Post = require('./models/postModel.js');
const Comment = require('./models/commentModel');
const Question = require('./models/questionModel.js');
const Answer = require('./models/answerModel.js');
const { getTest } = require('./test/testRepository.js');

const surveyController = require('./controllers/surveyController.js');
const surveyRouter = require('./routes/survey'); 
const SurveyData = require('./models/surveyAnswer.js');

<<<<<<< HEAD
const app = express();
=======
const app = express(); // `app` 객체 선언

>>>>>>> survey2
const port = process.env.PORT || 8181;
const corsOrigins = [process.env.CORS_ORIGIN || 'http://localhost', 'http://localhost:8181'];

// CORS 설정
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

// Middleware 설정
app.use(bodyParser.json()); // JSON 요청 본문 파싱 설정
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // 정적 파일 제공

<<<<<<< HEAD
const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    await User.bulkCreate([
      { name: 'Alice3', phone: '010-1111-1111', email: '123@gmail.com', password: await bcrypt.hash('123', 10), status: "child" },
      { name: 'Bob3', phone: '010-2222-2222', email: '456@gmail.com', password: await bcrypt.hash('456', 10), status: "parent" },
      { name: 'Charlie3', phone: '010-3333-3333', email: '789@gmail.com', password: await bcrypt.hash('789', 10), status: "child" },
    ]);

    console.log('Mock data inserted');
    await Post.bulkCreate([
      { author: 111, title: '첫 번째 게시글', status:'child', content: '이것은 첫 번째 게시글입니다.', createdAt: new Date() },
      { author: 222, title: '두 번째 게시글', status:'parent', content: '이것은 두 번째 게시글입니다.', createdAt: new Date() },
      { author: 333, title: '세 번째 게시글', status:'child', content: '이것은 세 번째 게시글입니다.', createdAt: new Date() },
    ]);

    console.log('Mock post data inserted');

    await Comment.bulkCreate([
      { postID: 111, author: 1, status: 'child', content: '첫 번째 댓글', createdAt: new Date() },
      { postID: 222, author: 2, status: 'parent', content: '두 번째 댓글', createdAt: new Date() },
      { postID: 333, author: 3, status: 'child', content: '세 번째 댓글', createdAt: new Date() },
    ])

    console.log('Mock comment data inserted');

    await Question.bulkCreate([
      { author: 111, title: '첫 번째 질문글', status:'child', content: '이것은 첫 번째 게시글입니다.', createdAt: new Date() },
      { author: 222, title: '두 번째 질문글', status:'parent', content: '이것은 두 번째 게시글입니다.', createdAt: new Date() },
      { author: 333, title: '세 번째 질문글', status:'parent', content: '이것은 세 번째 게시글입니다.', createdAt: new Date() },
    ]);

    console.log('Mock question data inserted');

    await Answer.bulkCreate([
      { questionID: 111, author: 1, status: 'child', content: '첫 번째 댓글', createdAt: new Date() },
      { questionID: 222, author: 2, status: 'parent', content: '두 번째 댓글', createdAt: new Date() },
      { questionID: 333, author: 3, status: 'expert', content: '세 번째 댓글', createdAt: new Date() },
    ])

    console.log('Mock answer data inserted');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

initializeApp();

app.use(express.static(path.join(__dirname, 'public')));
=======
// View 엔진 설정
>>>>>>> survey2
app.set('views', path.join(__dirname, 'src', 'views'));

// 라우터 설정
app.use("/", router);
app.use("/", postRouter);
<<<<<<< HEAD
app.use("/", commentRouter);
app.use("/", questionRouter);
app.use("/", answerRouter);
=======
app.use('/', surveyRouter);
>>>>>>> survey2

// 추가 라우트 설정
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

// 설문 제목 목록 가져오기
app.get('/surveys', surveyController.getSurveys);

// 특정 설문에 대한 질문 가져오기
app.get('/survey/:surveyId', surveyController.getSurveyQuestions);

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// 데이터베이스 초기화 및 동기화
const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    // Synchronize the database schema
    await sequelize.sync({ alter: true }); // alter: true to update schema
    console.log('Database synchronized');

    // Mock data insertion
    // Uncomment if you need to seed mock data each time
    /*
    await User.bulkCreate([
      { name: 'Alice', phone: '010-1111-1111', email: 'alice@gmail.com', password: 'hashed_password', status: '자녀' },
      { name: 'Bob', phone: '010-2222-2222', email: 'bob@gmail.com', password: 'hashed_password', status: '부모' },
      { name: 'Charlie', phone: '010-3333-3333', email: 'charlie@gmail.com', password: 'hashed_password', status: '자녀' },
    ]);

    await Survey.bulkCreate([
      { title: 'Customer Satisfaction Survey' },
      { title: 'Product Feedback Survey' },
    ]);

    await Question.bulkCreate([
      { surveyId: 1, text: 'How satisfied are you with our service?' },
      { surveyId: 1, text: 'Would you recommend us to others?' },
      // Add more questions as needed
    ]);
    */

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initializeApp();