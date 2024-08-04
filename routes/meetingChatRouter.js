const express = require('express');
const path = require('path');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const meetingChatController = require('../controllers/meetingChatController');

// 새로운 Meeting Chat Room 생성
router.post('/create/:meetID', authenticateJWT, meetingChatController.createMeetingChatRoom);

// 모든 Meeting Chat Room 가져오기
router.get('/rooms', authenticateJWT, meetingChatController.getAllMeetingChatRooms);

// 특정 ID의 Meeting Chat Room 가져오기
router.get('/room/:id', authenticateJWT, meetingChatController.getMeetingChatRoomById);

// 특정 Meet ID에 대한 채팅방 제공
router.get('/:meetID', authenticateJWT, (req, res) => {
    const meetID = req.params.meetID;
    res.sendFile(path.join(__dirname, '../public/template', 'chatroom.html')); 
});

module.exports = router;
