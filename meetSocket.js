const socketIo = require('socket.io');
const MeetingChatMessage = require('./models/chat/MeetingChatMessage');

let io; // io 객체를 전역 변수로 선언

const setupMeetSocket = (server, corsOrigins) => {
  io = socketIo(server, {
    cors: {
      origin: corsOrigins,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected to meeting chat');

    // 사용자가 채팅방에 입장할 때
    socket.on('joinRoom', ({ roomId, userId, username }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.userId = userId;
      socket.username = username;
      console.log(`User ${username} with ID ${userId} joined room ${roomId}`);

      // 해당 채팅방의 사용자 수를 업데이트
      const room = io.sockets.adapter.rooms.get(roomId);
      const userCount = room ? room.size : 0;
      io.to(roomId).emit('userCountUpdate', userCount);
    });

    // 사용자가 메시지를 전송할 때
    socket.on('sendMeetingMessage', async (message) => {
      try {
        if (!message.content || !message.senderType) {
          throw new Error('Message content and sender type are required');
        }

        const savedMessage = await MeetingChatMessage.create({
          meetingChatRoomId: message.meetingChatRoomId,
          senderId: message.senderId,
          senderType: message.senderType,
          content: message.content,
        });

        io.to(message.meetingChatRoomId).emit('receiveMeetingMessage', savedMessage);
      } catch (error) {
        console.error('Error creating meeting message:', error);
      }
    });

    // 사용자가 채팅방을 떠날 때
    socket.on('disconnect', () => {
      console.log('User disconnected from meeting chat');
      if (socket.roomId) {
        // 해당 채팅방의 사용자 수를 업데이트
        const room = io.sockets.adapter.rooms.get(socket.roomId);
        const userCount = room ? room.size : 0;
        io.to(socket.roomId).emit('userCountUpdate', userCount);
      }
    });
  });

  return io;
};

const getMeetIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { setupMeetSocket, getMeetIo };
