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


const app = express();
const port = process.env.PORT || 8181;
const corsOrigins = [process.env.CORS_ORIGIN || 'http://localhost', 'http://localhost:3000']; // CORS 허용 origin 배열

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

app.use(bodyParser.json()); // JSON 요청 본문 파싱 설정
app.use(bodyParser.urlencoded({ extended: true }));

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
app.set('views', path.join(__dirname, 'src', 'views'));

app.use("/", router);
app.use("/", postRouter);
app.use("/", commentRouter);
app.use("/", questionRouter);
app.use("/", answerRouter);

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
