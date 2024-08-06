// const socketIo = require('socket.io');
// const authenticateSocket = require('./middleware/authenticateSocket');
// const MeetingChatParticipant = require('./models/chat/MeetingChatParticipant');
// const MeetingChatMessage = require('./models/chat/MeetingChatMessage');

// let io;

// const setupSocket = (server, corsOrigins) => {
//   io = socketIo(server, {
//     cors: {
//       origin: corsOrigins,
//       methods: ['GET', 'POST'],
//       credentials: true
//     }
//   });

//   io.use(authenticateSocket); // 미들웨어를 사용하여 인증

//   io.on('connection', (socket) => {
//     console.log('A user connected');

//     socket.on('joinRoom', async ({ roomId, chatType }) => {
//       const userId = socket.user.id;
//       const username = socket.user.username;

//       socket.join(roomId);
//       socket.roomId = roomId;
//       socket.userId = userId;
//       socket.username = username;
//       socket.chatType = chatType;

//       console.log(`User ${username} with ID ${userId} joined ${chatType} room ${roomId}`);

//       const room = io.sockets.adapter.rooms.get(roomId);
//       const userCount = room ? room.size : 0;
//       io.to(roomId).emit('userCountUpdate', userCount);

//       if (chatType === 'meeting') {
//         try {
//           await MeetingChatParticipant.create({ meetingChatRoomId: roomId, userId: userId });
//         } catch (error) {
//           console.error('Error adding participant:', error);
//         }
//       }
//     });

//     socket.on('sendMessage', async (message) => {
//       const userId = socket.user.id;
//       const newMessage = {
//         ...message,
//         senderId: userId
//       };

//       try {
//         const savedMessage = await MeetingChatMessage.create(newMessage);
//         io.to(message.meetingChatRoomId).emit('receiveMessage', savedMessage);
//       } catch (error) {
//         console.error('Error creating message:', error);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected');
//       if (socket.roomId) {
//         const room = io.sockets.adapter.rooms.get(socket.roomId);
//         const userCount = room ? room.size : 0;
//         io.to(socket.roomId).emit('userCountUpdate', userCount);
//       }
//     });
//   });

//   return io;
// };

// const getIo = () => {
//   if (!io) {
//     throw new Error("Socket.io not initialized");
//   }
//   return io;
// };

// module.exports = { setupSocket, getIo };

const socketIo = require('socket.io');
const authenticateSocket = require('./middleware/authenticateSocket');
const MeetingChatParticipant = require('./models/chat/MeetingChatParticipant');
const MeetingChatMessage = require('./models/chat/MeetingChatMessage');
const OpenChatMessage = require('./models/chat/OpenChatMessage'); // 오픈 채팅 모델 추가
const ExpertChatMessage = require('./models/expertChat/expertmessageModel');
const Expert = require('./models/expertChat/expertModel');
const ExpertChat = require('./models/expertChat/expertchatModel');

let io;

const setupSocket = (server, corsOrigins) => {
  io = socketIo(server, {
    cors: {
      origin: corsOrigins,
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.use(authenticateSocket); // 미들웨어를 사용하여 인증

  io.on('connection', (socket) => {
    console.log('A user connected');

    // 모임 채팅
    socket.on('joinRoom', async ({ roomId, userId, username }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.userId = userId;
      socket.username = username;

      console.log(`User ${username} with ID ${userId} joined meeting room ${roomId}`);

      const room = io.sockets.adapter.rooms.get(roomId);
      const userCount = room ? room.size : 0;
      io.to(roomId).emit('userCountUpdate', userCount);

      try {
        await MeetingChatParticipant.create({ meetingChatRoomId: roomId, userId: userId });
      } catch (error) {
        console.error('Error adding participant:', error);
      }
    });

    socket.on('sendMessage', async (message) => {
      const newMessage = {
        ...message,
        senderId: socket.userId
      };

      try {
        const savedMessage = await MeetingChatMessage.create(newMessage);
        io.to(message.meetingChatRoomId).emit('receiveMessage', savedMessage);
      } catch (error) {
        console.error('Error creating meeting message:', error);
      }
    });

    // 오픈 채팅
    socket.on('joinOpenRoom', ({ roomId, userId, username }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.userId = userId;
      socket.username = username;

      console.log(`User ${username} with ID ${userId} joined open room ${roomId}`);

      const room = io.sockets.adapter.rooms.get(roomId);
      const userCount = room ? room.size : 0;
      io.to(roomId).emit('userCountUpdate', userCount);
    });

    socket.on('sendOpenMessage', async (message) => {
      try {
        const savedMessage = await OpenChatMessage.create(message);
        io.to(message.openChatRoomId).emit('receiveMessage', savedMessage);
      } catch (error) {
        console.error('Error creating open chat message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
      if (socket.roomId) {
        const room = io.sockets.adapter.rooms.get(socket.roomId);
        const userCount = room ? room.size : 0;
        io.to(socket.roomId).emit('userCountUpdate', userCount);
      }
    });

    //전문가 실시간 채팅
    socket.on('joinExpertChatRoom', async ({ roomId, userId, username }) => {
      socket.join(roomId);
      socket.roomId = roomId;
      socket.userId = userId;
      socket.username = username;

      console.log(`User ${username} with ID ${userId} joined expert chat room ${roomId}`);

      const room = io.sockets.adapter.rooms.get(roomId);
      const userCount = room ? room.size : 0;
      io.to(roomId).emit('userCountUpdate', userCount);
    });

    socket.on('sendExpertMessage', async (message) => {
      const newMessage = {
        ...message,
        senderId: socket.userId,
      };

      try {
        const savedMessage = await ExpertChatMessage.create(newMessage);
        io.to(message.expertChatRoomId).emit('receiveMessage', savedMessage);
      } catch (error) {
        console.error('Error creating expert chat message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
      if (socket.roomId) {
        const room = io.sockets.adapter.rooms.get(socket.roomId);
        const userCount = room ? room.size : 0;
        io.to(socket.roomId).emit('userCountUpdate', userCount);
      }
    });//    

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
