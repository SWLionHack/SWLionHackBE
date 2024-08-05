const { Op } = require('sequelize'); 
const Meet = require('../models/meet/MeetModel');
const MeetVote = require('../models/meet/MeetVoteModel');
const MeetingChatRoom = require('../models/chat/MeetingChatRoom');
const MeetingChatParticipant = require('../models/chat/MeetingChatParticipant');
const User = require('../models/User')
const { getIo } = require('../socket'); // socket.io 인스턴스를 가져오는 함수 임포트


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

    const meet = await Meet.findByPk(meetID);
    if (!meet) {
      return res.status(404).json({ error: 'Meet not found' });
    }

    if (meet.author === userID) {
      return res.status(403).json({ error: 'You cannot vote on your own meet' });
    }

    const existingVote = await MeetVote.findOne({ where: { meetID, voterID: userID } });

    if (existingVote) {
      await existingVote.destroy();
      return res.status(200).json({ message: 'Vote removed' });
    }

    await MeetVote.create({ meetID, voterID: userID });

    const currentVoteCount = await MeetVote.count({ where: { meetID } });

    if (currentVoteCount >= meet.maxCapacity) {
      const chatRoomName = `${meet.title}`;
      const meetingChatRoom = await MeetingChatRoom.create({ name: chatRoomName });

      // 참가자 추가 로직
      const votes = await MeetVote.findAll({ where: { meetID } });
      const participants = [meet.author, ...votes.map(vote => vote.voterID)];

      for (const userId of participants) {
        await MeetingChatParticipant.create({ meetingChatRoomId: meetingChatRoom.id, userId });
      }

      // Meet 게시물 삭제
      await meet.destroy();

      // 관련 참가자들에게 채팅방 참여 이벤트 전송
      const io = getIo();
      for (const userId of participants) {
        io.to(userId).emit('meetingChatRoomCreated', meetingChatRoom);
      }

      return res.status(201).json({ message: 'Meeting chat room created and meet deleted', meetingChatRoom });
    }

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
      offset,
      include: [
        { model: MeetVote, as: 'votes' }, // Meet와 관련된 투표(votes)도 함께 가져옵니다.
        { model: User, as: 'authorDetails', attributes: ['name'] } // User 모델을 조인하여 이름만 가져옵니다.
      ]
    });

    // 데이터를 클라이언트에 전달하기 위해 필요한 정보만 추출
    const data = activeMeets.rows.map(meet => ({
      meetID: meet.meetID,
      title: meet.title,
      content: meet.content,
      expirationTime: meet.expirationTime,
      author: meet.authorDetails.name, // author의 이름을 반환합니다.
      maxCapacity: meet.maxCapacity,
      createdAt: meet.createdAt,
      updatedAt: meet.updatedAt,
      currentVotes: meet.votes.length // 현재 투표된 인원 수
    }));

    res.status(200).json({
      totalPages: Math.ceil(activeMeets.count / limit),
      currentPage: page,
      data: data
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
