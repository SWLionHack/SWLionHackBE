const EverydayQuestion = require('../models/EverydayQuestion');

const createEverydayQuestion = async (req, res) => {
  const { question } = req.body;

  try {
    const newEverydayQuestion = await EverydayQuestion.create({ question });
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
