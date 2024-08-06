const express = require('express');
const router = express.Router();
const expertChatController = require('../controllers/expertChatController');
const authenticateToken = require('../middleware/authenticateToken');

// 모든 전문가를 가져오는 라우트
router.get('/experts', authenticateToken, expertChatController.getAllExperts);

// 유저가 참여한 채팅 방 불러오기
router.get('/chat-rooms', authenticateToken, expertChatController.getUserChatRooms);

// 특정 채팅 방의 전체 내용을 가져오는 라우트
router.get('/chat-rooms/:id/details', authenticateToken, expertChatController.getChatRoomDetails);

// 새로운 전문가 채팅 방을 생성하는 라우트
router.post('/chat-rooms', authenticateToken, expertChatController.createExpertChatRoom);

// 메시지를 보내는 라우트
router.post('/chat-rooms/:id/messages', authenticateToken, expertChatController.sendMessage);

// 특정 채팅방의 메시지를 불러오는 라우트
router.get('/chat-rooms/:id/messages', authenticateToken, expertChatController.getMessages);

module.exports = router;