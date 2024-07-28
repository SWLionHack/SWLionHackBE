require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const questionRouter = require('./routes/questionRouter.js');
const commentRouter = require('./routes/commentRouter');
const answerRouter = require('./routes/answerRouter.js');
const sequelize = require('./sequelize');
const User = require('./models/User');

const Post = require('./models/postModel');
const Comment = require('./models/commentModel');

const Question = require('./models/questionModel');
const Answer = require('./models/answerModel');
const surveyRouter = require('./routes/surveyRouter'); 
const SurveyQuestion = require('./models/surveyQuestions');
const SurveyAnswer = require('./models/surveyAnswer');
const chatRouter = require('./routes/chatRouter');
const mentoringRouter = require('./routes/mentoringRouter.js');

const Expert = require('./models/Expert');
const ChatRoom = require('./models/chat/ChatRoom');
const MentoringRoom = require('./models/chat/MentoringRoom.js');
const MentoringMessage = require('./models/chat/MentoringMessage.js');
const Message = require('./models/chat/Message'); 


/** open chat **/
const openChatRouter = require('./routes/openChatRouter');
const OpenChatRoom = require('./models/chat/OpenChatRoom')
const OpenChatMessage = require('./models/chat/OpenChatMessage');

// Define associations
OpenChatRoom.hasMany(OpenChatMessage, { as: 'messages', foreignKey: 'openChatRoomId' });
OpenChatMessage.belongsTo(OpenChatRoom, { foreignKey: 'openChatRoomId' });

const setupSocket = require('./socket'); 

const dailyQuestionRouter = require('./routes/dailyQuestionRouter');
const everydayQuestionRouter = require('./routes/everydayQuestionRouter');
const dailyQuestionBoardRouter = require('./routes/dailyQuestionBoardRouter');
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

app.use(cookieParser()); // 쿠키 파서 미들웨어 추가
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); 

User.hasMany(ChatRoom, { foreignKey: 'userId' });
Expert.hasMany(ChatRoom, { foreignKey: 'expertId' });
ChatRoom.belongsTo(User, { foreignKey: 'userId' });
ChatRoom.belongsTo(Expert, { foreignKey: 'expertId' });

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
      { name: 'Alice3', phone: '010-1111-1111', email: '123@gmail.com', password: await bcrypt.hash('123', 10), status: "child", birthdate: new Date('2009-01-01') },
      { name: 'Bob3', phone: '010-2222-2222', email: '456@gmail.com', password: await bcrypt.hash('456', 10), status: "parent", birthdate: new Date('2009-01-01') },
      { name: 'Charlie3', phone: '010-3333-3333', email: '789@gmail.com', password: await bcrypt.hash('789', 10), status: "child", birthdate: new Date('2009-01-01') },
    ]);

    console.log('User mock data inserted');

    await Expert.bulkCreate([
      { name: 'Dr. John Doe', phone: '010-4444-4444', email: 'john.doe@example.com', password: await bcrypt.hash('password1', 10), specialization: "심리학" },
      { name: 'Dr. Jane Smith', phone: '010-5555-5555', email: 'jane.smith@example.com', password: await bcrypt.hash('password2', 10), specialization: "정신의학" },
      { name: 'Dr. Emily Johnson', phone: '010-6666-6666', email: 'emily.johnson@example.com', password: await bcrypt.hash('password3', 10), specialization: "상담 치료" },
    ]);

    console.log('Expert mock data inserted');

    await Post.bulkCreate([
      { author: 1, status: 'child', title: '첫 번째 게시글', content: '이것은 첫 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 2, status: 'parent', title: '두 번째 게시글', content: '이것은 두 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 3, status: 'child', title: '세 번째 게시글', content: '이것은 세 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 4, status: 'parent', title: '네 번째 게시글', content: '이것은 네 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 5, status: 'child', title: '다섯 번째 게시글', content: '이것은 다섯 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 6, status: 'parent', title: '여섯 번째 게시글', content: '이것은 여섯 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 7, status: 'child', title: '일곱 번째 게시글', content: '이것은 일곱 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 8, status: 'parent', title: '여덟 번째 게시글', content: '이것은 여덟 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 9, status: 'child', title: '아홉 번째 게시글', content: '이것은 아홉 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 10, status: 'parent', title: '열 번째 게시글', content: '이것은 열 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 1, status: 'child', title: '열한 번째 게시글', content: '이것은 열한 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 2, status: 'parent', title: '열두 번째 게시글', content: '이것은 열두 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 3, status: 'child', title: '열세 번째 게시글', content: '이것은 열세 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 4, status: 'parent', title: '열네 번째 게시글', content: '이것은 열네 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 5, status: 'child', title: '열다섯 번째 게시글', content: '이것은 열다섯 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 6, status: 'parent', title: '열여섯 번째 게시글', content: '이것은 열여섯 번째 게시글의 내용입니다.', createdAt: new Date() },
    { author: 7, status: 'child', title: '열일곱 번째 게시글', content: '이것은 열일곱 번째 게시글의 내용입니다.', createdAt: new Date() },
   ]);

    console.log('Mock post data inserted');

    await Comment.bulkCreate([
      { postID: 1, author: 1, status: 'child', content: '첫 번째 댓글', createdAt: new Date() },
      { postID: 2, author: 2, status: 'parent', content: '두 번째 댓글', createdAt: new Date() },
      { postID: 3, author: 3, status: 'child', content: '세 번째 댓글', createdAt: new Date() },
    ]);

    console.log('Mock comment data inserted');

    await Question.bulkCreate([
      { author: 1, title: '첫 번째 질문글', status:'child', content: '이것은 첫 번째 게시글입니다.', createdAt: new Date() },
      { author: 2, title: '두 번째 질문글', status:'parent', content: '이것은 두 번째 게시글입니다.', createdAt: new Date() },
      { author: 3, title: '세 번째 질문글', status:'parent', content: '이것은 세 번째 게시글입니다.', createdAt: new Date() },
    ]);

    console.log('Mock question data inserted');

    await Answer.bulkCreate([
      { questionID: 1, author: 1, status: 'child', content: '첫 번째 댓글', createdAt: new Date() },
      { questionID: 2, author: 2, status: 'parent', content: '두 번째 댓글', createdAt: new Date() },
      { questionID: 3, author: 3, status: 'expert', content: '세 번째 댓글', createdAt: new Date() },
    ]);

    console.log('Mock answer data inserted');

    await SurveyQuestion.bulkCreate([
      { surveyId: 1, text: '지난 한 달 동안 얼마나 자주 스트레스를 느끼셨나요?' },
      { surveyId: 1, text: '지난 한 달 동안 얼마나 자주 불안감을 느끼셨나요?' },
      { surveyId: 2, text: '당신의 적성에 대해 얼마나 만족하십니까?' },
      { surveyId: 3, text: '지난 한 달 동안 얼마나 자주 우울감을 느끼셨나요?' },
      { surveyId: 4, text: '당신이 화를 낼 때 주로 어떤 방식으로 표출하나요?' },
      { surveyId: 5, text: '사회적 상황에서 얼마나 자주 불안을 느끼십니까?' },
    ]);

    console.log('Mock survey question data inserted');

    await SurveyAnswer.bulkCreate([
      { surveyId: 1, questionId: 1, answer: '전혀 그렇지 않다' },
      { surveyId: 1, questionId: 2, answer: '그렇지 않다' },
      { surveyId: 2, questionId: 3, answer: '보통이다' },
      { surveyId: 3, questionId: 4, answer: '그렇다' },
      { surveyId: 4, questionId: 5, answer: '매우 그렇다' },
    ]);

    console.log('Mock survey answer data inserted');

    await OpenChatRoom.bulkCreate([
      { name: 'General Chat' },
      { name: 'Tech Talk' },
      { name: 'Gaming' },
      { name: 'Movies & TV' },
      { name: 'Random' }
  ]);

    console.log('Mock open chat rooms data inserted');

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
app.use('/', surveyRouter);
app.use("/", chatRouter);
app.use("/", mentoringRouter);
app.use("/", dailyQuestionRouter);
app.use("/", everydayQuestionRouter);
app.use("/", dailyQuestionBoardRouter);

app.use('/api', openChatRouter);

const server = app.listen(port, () => {
  console.log(`Server running on :${port}`);
});


const io = setupSocket(server, corsOrigins);
