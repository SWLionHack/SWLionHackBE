const DailyQuestion = require('../models/daily_question/DailyQuestion');
const EverydayQuestion = require('../models/daily_question/EverydayQuestion');
const DailyQuestionLike = require('../models/daily_question/DailyQuestionLike')
const { Op } = require('sequelize');
const { getIo } = require('../socket'); // io 객체를 가져옵니다.

// 오늘의 질문 가져오기
const getCurrentEverydayQuestionWithUserAnswer = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const everydayQuestion = await EverydayQuestion.findOne({
      where: {
        date: {
          [Op.between]: [today, tomorrow]
        }
      }
    });

    if (!everydayQuestion) {
      return res.status(404).send('No everyday question found');
    }

    const userAnswer = await DailyQuestion.findOne({
      where: {
        userId: req.user.id,
        questionId: everydayQuestion.id
      }
    });

    res.status(200).json({
      question: everydayQuestion,
      answer: userAnswer ? userAnswer.content : null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

// 질문에 대한 답변 저장
const createDailyQuestion = async (req, res) => {
  try {
    const { content, questionId, isShared } = req.body;

    const everydayQuestion = await EverydayQuestion.findOne({
      where: {
        id: questionId
      }
    });

    if (!everydayQuestion) {
      return res.status(404).send('No everyday question found');
    }

    const newDailyQuestion = await DailyQuestion.create({
      title: everydayQuestion.question,
      content,
      userId: req.user.id,
      userName: req.user.name,
      questionId: everydayQuestion.id,
      isShared: isShared || false
    });

    // Emit socket event for shared answers
    if (newDailyQuestion.isShared) {
      const io = getIo();
      io.emit('receiveSharedAnswer', newDailyQuestion); // 새로운 공유 답변을 모든 클라이언트에게 전송합니다.
    }

    res.status(201).json(newDailyQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

// 모든 질문 가져오기
const getAllDailyQuestions = async (req, res) => {
  try {
    const dailyQuestions = await DailyQuestion.findAll({
      where: {
        userId: req.user.id
      }
    });

    res.status(200).json(dailyQuestions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

// 공유된 답변 가져오기
const getSharedAnswers = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    console.log("today : ", today);
    console.log("tomorrow : ", tomorrow);

    const everydayQuestion = await EverydayQuestion.findOne({
      where: {
        date: {
          [Op.between]: [today, tomorrow]
        }
      }
    });

    console.log("everydayQuestion : ", everydayQuestion);

    if (!everydayQuestion) {
      return res.status(404).send('No everyday question found');
    }

    const sharedAnswers = await DailyQuestion.findAll({
      where: {
        questionId: everydayQuestion.id,
        isShared: true
      }
    });

    res.status(200).json(sharedAnswers);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

const addLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // 이미 좋아요를 눌렀는지 확인합니다.
    const existingLike = await DailyQuestionLike.findOne({
      where: {
        userId,
        questionId: id
      }
    });

    if (existingLike) {
      return res.status(400).send('You have already liked this question');
    }

    // 좋아요를 추가합니다.
    await DailyQuestionLike.create({
      userId,
      questionId: id
    });

    // 질문의 좋아요 수를 증가시킵니다.
    const question = await DailyQuestion.findByPk(id);
    question.likes += 1;
    await question.save();

    // 소켓을 통해 업데이트 전송
    const io = getIo();
    io.emit('updateLikeCount', question);

    res.status(200).json(question);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  getCurrentEverydayQuestionWithUserAnswer,
  createDailyQuestion,
  getAllDailyQuestions,
  getSharedAnswers,
  addLike
};
