require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const router = require('./routes/router');
const postRouter = require('./routes/postRouter');
const commentRouter = require('./routes/commentRouter');
const chatRouter = require('./routes/chatRouter');
const sequelize = require('./sequelize'); // sequelize 경로 수정
const User = require('./models/User');
const Post = require('./models/postModel.js');
const Comment = require('./models/commentModel');
const Expert = require('./models/Expert');
const ChatRoom = require('./models/chat/ChatRoom'); // chat 폴더 내 ChatRoom 모델 불러오기
const Message = require('./models/chat/Message'); // chat 폴더 내 Message 모델 불러오기
const { getTest } = require('./test/testRepository.js');
const setupWebSocket = require('./wsServer'); // WebSocket 설정 파일 불러오기

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

// 모델 관계 설정
User.hasMany(ChatRoom, { foreignKey: 'userId' });
Expert.hasMany(ChatRoom, { foreignKey: 'expertId' });
ChatRoom.belongsTo(User, { foreignKey: 'userId' });
ChatRoom.belongsTo(Expert, { foreignKey: 'expertId' });

const initializeApp = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ alter: true });
    console.log('Database synchronized');

    await User.bulkCreate([
      { name: 'Alice3', phone: '010-1111-1111', email: '123@gmail.com', password: await bcrypt.hash('123', 10), status: "자녀" },
      { name: 'Bob3', phone: '010-2222-2222', email: '456@gmail.com', password: await bcrypt.hash('456', 10), status: "부모" },
      { name: 'Charlie3', phone: '010-3333-3333', email: '789@gmail.com', password: await bcrypt.hash('789', 10), status: "자녀" },
    ]);

    console.log('User mock data inserted');

    await Expert.bulkCreate([
      { name: 'Dr. John Doe', phone: '010-4444-4444', email: 'john.doe@example.com', password: await bcrypt.hash('password1', 10), specialization: "심리학" },
      { name: 'Dr. Jane Smith', phone: '010-5555-5555', email: 'jane.smith@example.com', password: await bcrypt.hash('password2', 10), specialization: "정신의학" },
      { name: 'Dr. Emily Johnson', phone: '010-6666-6666', email: 'emily.johnson@example.com', password: await bcrypt.hash('password3', 10), specialization: "상담 치료" },
    ]);

    console.log('Expert mock data inserted');

    await Post.bulkCreate([
      { author: 111, title: '첫 번째 게시글', status:'자녀', content: '이것은 첫 번째 게시글입니다.', createdAt: new Date() },
      { author: 222, title: '두 번째 게시글', status:'부모', content: '이것은 두 번째 게시글입니다.', createdAt: new Date() },
      { author: 333, title: '세 번째 게시글', status:'자녀', content: '이것은 세 번째 게시글입니다.', createdAt: new Date() },
    ]);

    console.log('Mock post data inserted');

    await Comment.bulkCreate([
      { postID: 111, author: 1, status: '자녀', content: '첫 번째 댓글', createdAt: new Date() },
      { postID: 222, author: 2, status: '부모', content: '두 번째 댓글', createdAt: new Date() },
      { postID: 333, author: 3, status: '자녀', content: '세 번째 댓글', createdAt: new Date() },
    ]);

    console.log('Mock comment data inserted');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initializeApp();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'src', 'views'));

app.use("/", router);
app.use("/", postRouter);
app.use("/", commentRouter);
app.use("/", chatRouter); // 추가

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

const server = app.listen(port, () => {
  console.log(`Server running on :${port}`);
});

// WebSocket 서버 설정
setupWebSocket(server);
