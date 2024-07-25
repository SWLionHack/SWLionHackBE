const express = require('express');
const ChatRoom = require('../models/chat/ChatRoom');
const Message = require('../models/chat/Message');
const router = express.Router();

router.post('/chatroom', async (req, res) => {
  const { userId, expertId, name } = req.body;
  try {
    // 이미 존재하는 채팅방이 있는지 확인
    const existingChatRoom = await ChatRoom.findOne({ where: { userId, expertId } });
    if (existingChatRoom) {
      return res.status(400).json({ error: 'Chat room already exists between this user and expert' });
    }

    // 새로운 채팅방 생성
    const chatRoom = await ChatRoom.create({ userId, expertId, name });
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/chatrooms', async (req, res) => {
  try {
    const chatRooms = await ChatRoom.findAll();
    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/chatroom/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const chatRoom = await ChatRoom.findByPk(id, {
      include: [{ model: Message }]
    });
    if (chatRoom) {
      res.json(chatRoom);
    } else {
      res.status(404).json({ error: 'Chat room not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/chatroom/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await ChatRoom.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
