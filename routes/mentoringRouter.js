const express = require('express');
const MentoringRoom = require('../models/chat/MentoringRoom');
const MentoringMessage = require('../models/chat/MentoringMessage');
const User = require('../models/User');
const router = express.Router();

//일단 멘티가 방을 만들고 멘토로 멘티보다 나이가 많은 사람이 들어오면 채팅 성사?
router.post('/mentoringroom', async (req, res) => {
  const { menteeId, mentorId, name } = req.body;
  try {
    //멘토멘티 정보 조회
    const mentee = await User.findByPk(menteeId);
    const mentor = await User.findByPk(mentorId);

    if (!mentee || !mentor){
        return res.status(404).json({ error: 'User not found' });
    }
    //멘토는 멘티보다 나이가 많아야 한다.
    if (mentor.age <= mentee.age) {
        return res.status(400).json({ error: 'Mentor must be older than mentee'});
    }

    // 이미 존재하는 채팅방이 있는지 확인
    const existingChatRoom = await MentoringRoom.findOne({ where: { menteeId, mentorId } });
    if (existingChatRoom) {
      return res.status(400).json({ error: 'Chat room already exists between you' });
    }

    

    // 새로운 채팅방 생성
    const chatRoom = await MentoringRoom.create({ menteeId, mentorId, name });
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/mentoringrooms', async (req, res) => {
  try {
    const chatRooms = await MentoringRoom.findAll();
    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/mentoringroom/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const chatRoom = await MentoringRoom.findByPk(id, {
      include: [{ model: MentoringMessage }]
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

router.delete('/mentoringroom/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await MentoringRoom.destroy({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;