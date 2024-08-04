const { Op } = require('sequelize'); 
const Meet = require('../models/meet/MeetModel');
const MeetVote = require('../models/meet/MeetVoteModel');
const MeetingChatRoom = require('../models/chat/MeetingChatRoom');

exports.createMeet = async (req, res) => {
  try {
    const { title, content, expirationTime, maxCapacity } = req.body;
    const meet = await Meet.create({ title, content, expirationTime, author: req.user.id, maxCapacity });
    res.status(201).json(meet);
  } catch (err) {
    console.error('Error creating Meet:', err);
    res.status(500).json({ error: 'Failed to create Meet', details: err.message });
  }
};

exports.voteMeet = async (req, res) => {
  try { 
    const { meetID } = req.params;
    const userID = req.user.id;

    // Meet을 찾아서 작성자가 본인인지 확인
    const meet = await Meet.findByPk(meetID);
    if (!meet) {
      return res.status(404).json({ error: 'Meet not found' });
    }

    // 작성자는 자신의 글에 투표하지 못하도록 함
    if (meet.author === userID) {
      return res.status(403).json({ error: 'You cannot vote on your own meet' });
    }

    // 이미 투표한 사용자인지 확인
    const existingVote = await MeetVote.findOne({ where: { meetID, voterID: userID } });

    if (existingVote) {
      // 이미 투표한 경우, 투표를 취소 (삭제)
      await existingVote.destroy();
      return res.status(200).json({ message: 'Vote removed' });
    }

    // 새로운 투표 등록
    await MeetVote.create({ meetID, voterID: userID });

    // 현재 meetID에 해당하는 Meet의 투표 수 확인
    const currentVoteCount = await MeetVote.count({ where: { meetID } });

    // 필요한 인원이 모두 모였는지 확인
    if (currentVoteCount >= meet.maxCapacity) {
      // 필요한 인원이 모두 모인 경우, 채팅방 생성
      const chatRoomName = `${meet.title} Chat Room`;
      const meetingChatRoom = await MeetingChatRoom.create({ name: chatRoomName });

      // Meet 게시물 삭제
      await meet.destroy();

      return res.status(201).json({ message: 'Meeting chat room created and meet deleted', meetingChatRoom });
    }

    // 투표가 성공적으로 등록되었음을 반환
    res.status(200).json({ message: 'Vote added' });
  } catch (err) {
    console.error('Error voting on Meet:', err);
    res.status(500).json({ error: 'Failed to vote', details: err.message });
  }
};



exports.getExpiredMeets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const expiredMeets = await Meet.findAndCountAll({
      where: {
        expirationTime: { [Op.lt]: new Date() }
      },
      order: [['createdAt', 'DESC']], // 나중에 생성된 투표가 먼저 출력되도록 설정
      limit,
      offset
    });

    res.status(200).json({
      totalPages: Math.ceil(expiredMeets.count / limit),
      currentPage: page,
      data: expiredMeets.rows
    });
  } catch (err) {
    console.error('Error getting expired Meets:', err);
    res.status(500).json({ error: 'Failed to get expired Meets', details: err.message });
  }
};

exports.deleteMeet = async (req, res) => {
  try {
    const { meetID } = req.params;
    const meet = await Meet.findByPk(meetID);

    if (!meet || meet.author !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this Meet' });
    }

    await meet.destroy();
    res.status(200).json({ message: 'Meet deleted' });
  } catch (err) {
    console.error('Error deleting Meet:', err);
    res.status(500).json({ error: 'Failed to delete Meet', details: err.message });
  }
};

// 진행 중인 Meet 제목 및 만료 시간 조회
exports.getActiveMeetTitlesAndExpiration = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const currentTime = new Date();
    const activeMeets = await Meet.findAndCountAll({
      where: {
        expirationTime: { [Op.gt]: currentTime }
      },
      order: [['createdAt', 'DESC']], // 나중에 생성된 투표가 먼저 출력되도록 설정
      limit,
      offset
    });

    res.status(200).json({
      totalPages: Math.ceil(activeMeets.count / limit),
      currentPage: page,
      data: activeMeets.rows
    });
  } catch (err) {
    console.error('Error getting active Meet titles and expiration times:', err);
    res.status(500).json({ error: 'Failed to get active Meet titles and expiration times', details: err.message });
  }
};

exports.getMeetDetails = async (req, res) => {
  try {
    const { meetID } = req.params;
    const meet = await Meet.findByPk(meetID, {
      include: [{ model: MeetVote, as: 'votes' }]
    });

    if (!meet) {
      return res.status(404).json({ error: 'Meet not found' });
    }

    res.status(200).json(meet);
  } catch (err) {
    console.error('Error getting Meet details:', err);
    res.status(500).json({ error: 'Failed to get Meet details', details: err.message });
  }
};
