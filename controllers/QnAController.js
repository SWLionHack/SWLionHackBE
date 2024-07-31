const { Op } = require('sequelize'); 
const QnA = require('../models/qna/QnAModel');
const QnAVote = require('../models/qna/QnAVoteModel');

exports.createQnA = async (req, res) => {
  try {
    const { title, content, expirationTime } = req.body;
    const qna = await QnA.create({ title, content, expirationTime, author: req.user.id });
    res.status(201).json(qna);
  } catch (err) {
    console.error('Error creating QnA:', err);
    res.status(500).json({ error: 'Failed to create QnA', details: err.message });
  }
};

exports.voteQnA = async (req, res) => {
  try {
    const { qnaID } = req.params;
    const userID = req.user.id;

    const existingVote = await QnAVote.findOne({ where: { qnaID, voterID: userID } });

    if (existingVote) {
      await existingVote.destroy();
      return res.status(200).json({ message: 'Vote removed' });
    }

    const qna = await QnA.findByPk(qnaID);
    if (!qna || new Date() > new Date(qna.expirationTime)) {
      return res.status(400).json({ error: 'Voting period has expired' });
    }

    await QnAVote.create({ qnaID, voterID: userID });
    res.status(200).json({ message: 'Vote added' });
  } catch (err) {
    console.error('Error voting on QnA:', err);
    res.status(500).json({ error: 'Failed to vote', details: err.message });
  }
};

exports.getExpiredQnAs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const expiredQnAs = await QnA.findAndCountAll({
      where: {
        expirationTime: { [Op.lt]: new Date() }
      },
      order: [['createdAt', 'DESC']], // 나중에 생성된 투표가 먼저 출력되도록 설정
      limit,
      offset
    });

    res.status(200).json({
      totalPages: Math.ceil(expiredQnAs.count / limit),
      currentPage: page,
      data: expiredQnAs.rows
    });
  } catch (err) {
    console.error('Error getting expired QnAs:', err);
    res.status(500).json({ error: 'Failed to get expired QnAs', details: err.message });
  }
};

exports.deleteQnA = async (req, res) => {
  try {
    const { qnaID } = req.params;
    const qna = await QnA.findByPk(qnaID);

    if (!qna || qna.author !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this QnA' });
    }

    await qna.destroy();
    res.status(200).json({ message: 'QnA deleted' });
  } catch (err) {
    console.error('Error deleting QnA:', err);
    res.status(500).json({ error: 'Failed to delete QnA', details: err.message });
  }
};

// 진행 중인 QnA 제목 및 만료 시간 조회
exports.getActiveQnATitlesAndExpiration = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const currentTime = new Date();
    const activeQnAs = await QnA.findAndCountAll({
      where: {
        expirationTime: { [Op.gt]: currentTime }
      },
      order: [['createdAt', 'DESC']], // 나중에 생성된 투표가 먼저 출력되도록 설정
      limit,
      offset
    });

    res.status(200).json({
      totalPages: Math.ceil(activeQnAs.count / limit),
      currentPage: page,
      data: activeQnAs.rows
    });
  } catch (err) {
    console.error('Error getting active QnA titles and expiration times:', err);
    res.status(500).json({ error: 'Failed to get active QnA titles and expiration times', details: err.message });
  }
};

exports.getQnADetails = async (req, res) => {
  try {
    const { qnaID } = req.params;
    const qna = await QnA.findByPk(qnaID, {
      include: [{ model: QnAVote, as: 'votes' }]
    });

    if (!qna) {
      return res.status(404).json({ error: 'QnA not found' });
    }

    res.status(200).json(qna);
  } catch (err) {
    console.error('Error getting QnA details:', err);
    res.status(500).json({ error: 'Failed to get QnA details', details: err.message });
  }
};
