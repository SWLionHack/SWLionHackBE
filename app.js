require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const sequelize = require('./sequelize');

/** user **/
const userRouter = require('./routes/userRouter');

const User = require('./models/User');

/** community **/
const questionRouter = require('./routes/questionRouter.js');
const commentRouter = require('./routes/commentRouter');
const postRouter = require('./routes/postRouter');
const answerRouter = require('./routes/answerRouter.js');

/** open chat **/
const openChatRouter = require('./routes/openChatRouter');
const chatRouter = require('./routes/chatRouter');

const ChatRoom = require('./models/chat/ChatRoom');
const OpenChatRoom = require('./models/chat/OpenChatRoom');
const OpenChatMessage = require('./models/chat/OpenChatMessage');

/** daily question **/
const dailyQuestionRouter = require('./routes/dailyQuestionRouter');
const everydayQuestionRouter = require('./routes/everydayQuestionRouter');

const EverydayQuestion = require('./models/daily_question/EverydayQuestion');
const DailyQuestion = require('./models/daily_question/DailyQuestion');

/** map academy **/
const academyRouter = require('./routes/academyRouter');

const schedule = require('node-schedule');
const { setupSocket } = require('./socket');
const insertMockData = require('./mockData');


const mentoringRouter = require('./routes/mentoringRouter.js');
const Expert = require('./models/Expert');

// Define associations
OpenChatRoom.hasMany(OpenChatMessage, { as: 'messages', foreignKey: 'openChatRoomId' });
OpenChatMessage.belongsTo(OpenChatRoom, { foreignKey: 'openChatRoomId' });

User.hasMany(ChatRoom, { foreignKey: 'userId' });
Expert.hasMany(ChatRoom, { foreignKey: 'expertId' });
ChatRoom.belongsTo(User, { foreignKey: 'userId' });
ChatRoom.belongsTo(Expert, { foreignKey: 'expertId' });

const app = express(); // 앱 변수 정의

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

app.use(cookieParser()); // 쿠키 파서 미들웨어 추가
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 

// 매일 오후 0시에 게시판 초기화
schedule.scheduleJob('0 0 * * *', async () => {
  try {
    await DailyQuestion.destroy({ where: {} });
    console.log('DailyQuestion has been reset');
  } catch (err) {
    console.error('Failed to reset DailyQuestion:', err);
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

    // Foreign key constraints removal
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');

    await sequelize.sync({ force: true });
    console.log('Database synchronized');

    // Foreign key constraints re-enable
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    // Insert mock data
    await insertMockData();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initializeApp();

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'src', 'views'));

app.use("/", userRouter);
app.use("/", postRouter);
app.use("/", commentRouter);
app.use("/", questionRouter);
app.use("/", answerRouter);
app.use("/", chatRouter);
app.use("/", mentoringRouter);

app.use("/", dailyQuestionRouter);
app.use("/", everydayQuestionRouter);

app.use('/api', openChatRouter);

app.use('/map_academy', academyRouter);

const server = app.listen(port, () => {
  console.log(`Server running on :${port}`);
});

setupSocket(server, corsOrigins); // io 객체 초기화

module.exports = app;
