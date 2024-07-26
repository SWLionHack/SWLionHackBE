const EverydayQuestion = require('../models/EverydayQuestion');

const createEverydayQuestion = async (req, res) => {
  const { question } = req.body;

  try {
    // 현재 가장 높은 order 값을 찾음
    const maxOrder = await EverydayQuestion.max('order') || 0;

    // 새로운 질문 생성 시 order 값을 현재 가장 높은 order 값 + 1로 설정
    const newEverydayQuestion = await EverydayQuestion.create({ question, order: maxOrder + 1 });
    res.status(201).json(newEverydayQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

const getEverydayQuestion = async (req, res) => {
  try {
    const everydayQuestion = await EverydayQuestion.findOne({
      order: [['date', 'DESC']]
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
  createEverydayQuestion,
  getEverydayQuestion
};
