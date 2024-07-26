const DailyQuestionBoard = require('../models/DailyQuestionBoard');
const DailyQuestion = require('../models/DailyQuestion');

const getDailyQuestionBoard = async (req, res) => {
  try {
    const boardEntries = await DailyQuestionBoard.findAll({
      include: {
        model: DailyQuestion,
        attributes: ['title', 'content', 'date', 'userName']
      },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(boardEntries);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

const shareDailyQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const dailyQuestion = await DailyQuestion.findOne({ where: { id, userId: req.user.id } });

    if (!dailyQuestion) {
      return res.status(404).send('DailyQuestion not found or not authorized');
    }

    dailyQuestion.isShared = true;
    await dailyQuestion.save();

    await DailyQuestionBoard.create({ dailyQuestionId: dailyQuestion.id, userId: dailyQuestion.userId });

    res.status(200).json(dailyQuestion);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

const likeDailyQuestion = async (req, res) => {
  const { dailyQuestionId } = req.params;
  const userId = req.user.id;

  try {
    const boardEntry = await DailyQuestionBoard.findOne({ where: { dailyQuestionId } });

    if (!boardEntry) {
      return res.status(404).send('DailyQuestion not found on board');
    }

    if (boardEntry.likedUsers.includes(userId)) {
      return res.status(400).send('You have already liked this DailyQuestion');
    }

    boardEntry.likes += 1;
    boardEntry.likedUsers.push(userId);
    await boardEntry.save();

    res.status(200).json(boardEntry);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  getDailyQuestionBoard,
  shareDailyQuestion,
  likeDailyQuestion
};
