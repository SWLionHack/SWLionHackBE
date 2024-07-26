const DailyQuestion = require('../models/DailyQuestion');
const EverydayQuestion = require('../models/EverydayQuestion');

// 새로운 dailyQuestion 생성
const createDailyQuestion = async (req, res) => {
  const { content, date } = req.body;
  const userId = req.user.id;
  const userName = req.user.name;

  try {
    const everydayQuestion = await EverydayQuestion.findOne({
      order: [['order', 'ASC']]
    });

    const title = everydayQuestion ? everydayQuestion.question : "No Question Today";
    const newDailyQuestion = await DailyQuestion.create({ title, content, date, userId, userName });
    res.status(201).json(newDailyQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

// 로그인한 사용자의 모든 dailyQuestion 조회
const getAllDailyQuestions = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const offset = (page - 1) * size;
  const limit = size;

  try {
    const { count, rows } = await DailyQuestion.findAndCountAll({
      where: { userId },
      offset,
      limit
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      dailyQuestions: rows
    });
  } catch (err) {
    console.error('Internal server error:', err);
    res.status(500).send('Internal server error');
  }
};

// 현재 설정된 everydayQuestion 반환
const getCurrentEverydayQuestion = async (req, res) => {
  try {
    const everydayQuestion = await EverydayQuestion.findOne({
      order: [['order', 'ASC']]
    });

    if (!everydayQuestion) {
      return res.status(404).send('No everyday question found');
    }

    res.status(200).json(everydayQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  createDailyQuestion,
  getAllDailyQuestions,
  getCurrentEverydayQuestion
};
