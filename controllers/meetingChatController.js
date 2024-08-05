const MeetingChatRoom = require('../models/chat/MeetingChatRoom');
const MeetingChatMessage = require('../models/chat/MeetingChatMessage');
const Meet = require('../models/meet/MeetModel');
const MeetVote = require('../models/meet/MeetVoteModel');
const MeetingChatParticipant = require('../models/chat/MeetingChatParticipant'); 


exports.createMeetingChatRoom = async (req, res) => {
  const { meetID } = req.params;

  try {
    // 주어진 meetID로 Meet을 찾음
    const meet = await Meet.findByPk(meetID, {
      include: [{ model: MeetVote, as: 'votes' }]
    });

    if (!meet) {
      return res.status(404).json({ error: 'Meet not found' });
    }

    // 현재 투표 수 확인
    const currentVoteCount = await MeetVote.count({ where: { meetID } });

    // 참가자가 충분하지 않은 경우 에러 반환
    if (currentVoteCount < meet.maxCapacity) {
      return res.status(400).json({ error: 'Not enough participants to create chat room' });
    }

    // 새로운 Meeting Chat Room 생성
    const chatRoomName = `${meet.title} Chat Room`;
    const meetingChatRoom = await MeetingChatRoom.create({ name: chatRoomName });

    // Meet 작성자와 투표한 사용자들을 MeetingChatParticipant에 추가
    const participants = [meet.author, ...meet.votes.map(vote => vote.voterID)];

    for (const userId of participants) {
      await MeetingChatParticipant.create({
        meetingChatRoomId: meetingChatRoom.id,
        userId,
      });
    }

    // Meet 글 삭제
    await meet.destroy();

    res.status(201).json({ message: 'Meeting chat room created and participants added', meetingChatRoom });
  } catch (error) {
    console.error('Error creating meeting chat room:', error);
    res.status(500).json({ error: 'Failed to create meeting chat room', details: error.message });
  }
};

exports.getAllMeetingChatRooms = async (req, res) => {
  try {
    // 모든 Meeting Chat Room을 가져옴
    const chatRooms = await MeetingChatRoom.findAll();
    res.status(200).json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching meeting chat rooms' });
  }
};

exports.getMeetingChatRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    // 주어진 ID로 Meeting Chat Room을 찾고 Chat Room 메세지 가져오기
    const chatRoom = await MeetingChatRoom.findByPk(id, {
      include: [{ model: MeetingChatMessage }]
    });
    if (chatRoom) {
      res.status(200).json(chatRoom);
    } else {
      res.status(404).json({ error: 'Meeting chat room not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching meeting chat room' });
  }
};
