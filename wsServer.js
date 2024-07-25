const WebSocket = require('ws');
const ChatRoom = require('./models/chat/ChatRoom');
const Message = require('./models/chat/Message');

const setupWebSocket = (server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    ws.on('message', async (message) => {
      console.log('Received message:', message);
      const parsedMessage = JSON.parse(message);
      const { chatRoomId, senderId, senderType, content } = parsedMessage;

      // 메시지를 데이터베이스에 저장
      const newMessage = await Message.create({
        chatRoomId,
        senderId,
        senderType,
        content,
        createdAt: new Date(),
      });

      // 채팅방에 연결된 모든 클라이언트에게 메시지 전송
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            chatRoomId,
            newMessage: {
              id: newMessage.id,
              content: newMessage.content,
              senderId: newMessage.senderId,
              senderType: newMessage.senderType,
              createdAt: newMessage.createdAt,
            },
          }));
        }
      });
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
};

module.exports = setupWebSocket;
