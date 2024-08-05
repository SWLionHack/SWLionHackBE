const MeetingChatRoom = require('../models/chat/MeetingChatRoom');
const MeetingChatParticipant = require('../models/chat/MeetingChatParticipant');
const MeetingChatMessage = require('../models/chat/MeetingChatMessage');

exports.createMeetingChatRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const newChatRoom = await MeetingChatRoom.create({ name });
    await MeetingChatParticipant.create({ meetingChatRoomId: newChatRoom.id, userId: req.user.id });
    res.status(201).json(newChatRoom);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create chat room' });
  }
};

exports.getAllMeetingChatRooms = async (req, res) => {
  try {
    const chatRooms = await MeetingChatRoom.findAll();
    res.status(200).json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat rooms' });
  }
};

exports.getMeetingChatRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const chatRoom = await MeetingChatRoom.findByPk(id, {
      include: [{ model: MeetingChatMessage, order: [['createdAt', 'ASC']] }]
    });

    if (!chatRoom) {
      return res.status(404).json({ error: 'Chat room not found' });
    }

    res.status(200).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat room' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    console.log('req.user:', req.user); // 디버그 로그 추가

    const { id } = req.params;
    const { content } = req.body;

    // 사용자 이름을 req.user 객체에서 가져옵니다.
    const senderName = req.user.name;

    const newMessage = await MeetingChatMessage.create({
      meetingChatRoomId: id,
      senderId: req.user.id,
      senderName,
      senderType: 'user',
      content,
    });

    const io = require('../socket').getIo();
    io.to(id).emit('receiveMessage', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error(error); // 오류 로그 추가
    res.status(500).json({ error: 'Failed to send message' });
  }
};
