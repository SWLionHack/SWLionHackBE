const { Op } = require('sequelize'); 
const ExpertChatRoom = require('../models/expertChat/expertchatModel');
const Expert = require('../models/expertChat/expertModel');
const ExpertChatMessage = require('../models/expertChat/expertMessage');
const { getIo } = require('../socket'); // socket.io 인스턴스를 가져오는 함수 임포트
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// 전문가 리스트를 가져오는 함수
exports.getAllExperts = async (req, res) => {
    try {
        const experts = await Expert.findAll();
        res.status(200).json(experts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch experts' });
    }
};

// 사용자가 들어가 있는 채팅 방의 기본 정보를 가져오는 함수
exports.getUserChatRooms = async (req, res) => {
    try {
        const chatRooms = await ExpertChatRoom.findAll({
            where: { userId: req.user.id },
            include: [
                {
                    model: Expert,
                    as: 'expert',
                    attributes: ['name', 'email', 'phone', 'status']
                }
            ]
        });
        res.status(200).json(chatRooms);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat rooms' });
    }
};

// 특정 채팅 방의 전체 내용을 가져오는 함수
exports.getChatRoomDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const chatRoom = await ExpertChatRoom.findByPk(id, {
            include: [
                {
                    model: ExpertChatMessage,
                    as: 'messages',
                    order: [['createdAt', 'ASC']]
                }
            ]
        });

        if (!chatRoom) {
            return res.status(404).json({ error: 'Chat room not found' });
        }

        res.status(200).json(chatRoom);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chat room details' });
    }
};

// 전문가와의 채팅 방을 생성하는 함수
exports.createExpertChatRoom = async (req, res) => {
    try {
        const { expertId } = req.body;

        // 기존 채팅 방이 있는지 확인
        const existingRoom = await ExpertChatRoom.findOne({
            where: { expertId, userId: req.user.id },
            include: [
                {
                    model: ExpertChatMessage,
                    as: 'messages',
                    order: [['createdAt', 'ASC']]
                }
            ]
        });

        // 기존 채팅 방이 있으면 해당 방을 반환
        if (existingRoom) {
            return res.status(200).json(existingRoom);
        }

        // 새로운 채팅 방 생성
        const newChatRoom = await ExpertChatRoom.create({
            expertId,
            userId: req.user.id,
        });

        res.status(201).json(newChatRoom);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create chat room' });
    }
};

// 메시지를 보내고 저장하는 함수
exports.sendMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;

        const senderId = req.user.id;
        const senderName = req.user.name;
        const senderStatus = req.user.status;

        const newMessage = await ExpertChatMessage.create({
            expertChatRoomId: id,
            senderId,
            senderName,
            senderStatus,
            content,
        });

        const io = require('../socket').getIo();
        io.to(id).emit('receiveMessage', newMessage);

        res.status(201).json(newMessage);
    } catch (error) {
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// 특정 채팅방의 메시지를 불러오는 함수
exports.getMessages = async (req, res) => {
    try {
        const { id } = req.params;
        const messages = await ExpertChatMessage.findAll({
            where: { expertChatRoomId: id },
            order: [['createdAt', 'ASC']]
        });

        if (!messages) {
            return res.status(404).json({ error: 'No messages found' });
        }

        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }

};

module.exports={
    getAllExperts,
    getUserChatRooms,
    getChatRoomDetails,
    createExpertChatRoom,
    sendMessage,
    getMessages
}