const express = require('express');
const { getAllChatRooms, getChatRoomById, createChatRoom } = require('../controllers/openChatController');
const router = express.Router();

router.get('/open-chat-rooms', getAllChatRooms);
router.get('/chatroom/:id', getChatRoomById);
router.post('/chatroom', createChatRoom);

module.exports = router;
