const socketIo = require('socket.io');
const OpenChatMessage = require('./models/chat/OpenChatMessage');

const setupSocket = (server, corsOrigins) => {
  const io = socketIo(server, {
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
    });

    socket.on('sendMessage', async (message) => {
      try {
        const savedMessage = await OpenChatMessage.create(message);
        io.to(message.openChatRoomId).emit('receiveMessage', savedMessage);
      } catch (error) {
        console.error('Error creating message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};

module.exports = setupSocket;
