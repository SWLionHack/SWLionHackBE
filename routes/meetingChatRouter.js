const express = require('express');
const path = require('path');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const meetingChatController = require('../controllers/meetingChatController');
const MeetingChatMessage = require('../models/chat/MeetingChatMessage');

// 새로운 Meeting Chat Room 생성
router.post('/create/:meetID', authenticateJWT, meetingChatController.createMeetingChatRoom);

// 모든 Meeting Chat Room 가져오기
router.get('/rooms', authenticateJWT, meetingChatController.getAllMeetingChatRooms);

// 특정 ID의 Meeting Chat Room 가져오기
router.get('/room/:id', authenticateJWT, meetingChatController.getMeetingChatRoomById);

// 특정 Meet ID에 대한 채팅방 제공
router.get('/:meetID', authenticateJWT, (req, res) => {
    const meetID = req.params.meetID;
    res.sendFile(path.join(__dirname, '../', 'index.html')); 
});

router.get('/:meetID/messages', async (req, res) => {
  try {
    const meetID = req.params.meetID;
    const messages = await MeetingChatMessage.findAll({
      where: { meetingChatRoomId: meetID },
      order: [['createdAt', 'ASC']] // 오래된 메시지부터 가져옴
    });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
});
  

module.exports = router;
