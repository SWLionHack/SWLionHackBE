const socketIo = require('socket.io');
const OpenChatMessage = require('./models/chat/OpenChatMessage');

let io; // io 객체를 전역 변수로 선언

const setupSocket = (server, corsOrigins) => {
  io = socketIo(server, {
    cors: {
      origin: corsOrigins,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', ({ roomId, userId, username }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.userId = userId;
      socket.username = username;
      console.log(`User ${username} with ID ${userId} joined room ${roomId}`);

      // Update user count for the room
      const room = io.sockets.adapter.rooms.get(roomId);
      const userCount = room ? room.size : 0;
      io.to(roomId).emit('userCountUpdate', userCount);
    });

    socket.on('sendMessage', async (message) => {
      try {
        const savedMessage = await OpenChatMessage.create(message);
        io.to(message.openChatRoomId).emit('receiveMessage', savedMessage);
      } catch (error) {
        console.error('Error creating message:', error);
      }
    });

    socket.on('sendSharedAnswer', (answer) => {
      io.emit('receiveSharedAnswer', answer); // 모든 연결된 클라이언트에게 이벤트 전송
    });

    socket.on('likeAnswer', (updatedAnswer) => {
      io.emit('updateLikeCount', updatedAnswer); // 좋아요 수 업데이트를 모든 클라이언트에게 전송
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
      if (socket.roomId) {
        // Update user count for the room
        const room = io.sockets.adapter.rooms.get(socket.roomId);
        const userCount = room ? room.size : 0;
        io.to(socket.roomId).emit('userCountUpdate', userCount);
      }
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

module.exports = { setupSocket, getIo };
