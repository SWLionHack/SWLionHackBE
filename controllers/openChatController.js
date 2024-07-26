const OpenChatRoom = require('../models/chat/OpenChatRoom');
const OpenChatMessage = require('../models/chat/OpenChatMessage');

exports.getAllChatRooms = async (req, res) => {
  try {
    const chatRooms = await OpenChatRoom.findAll();
    res.status(200).json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chat rooms' });
  }
};

exports.getChatRoomById = async (req, res) => {
  const { id } = req.params;
  try {
    const chatRoom = await OpenChatRoom.findByPk(id, {
      include: [{ model: OpenChatMessage }]
    });
    if (chatRoom) {
      res.status(200).json(chatRoom);
    } else {
      res.status(404).json({ error: 'Chat room not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching chat room' });
  }
};

exports.createChatRoom = async (req, res) => {
  const { name, description } = req.body;
  try {
    const chatRoom = await OpenChatRoom.create({ name, description });
    res.status(201).json(chatRoom);
  } catch (error) {
    res.status(500).json({ error: 'Error creating chat room' });
  }
};
