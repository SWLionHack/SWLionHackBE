const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.query.token || socket.handshake.headers['authorization'];

  if (!token) {
    return next(new Error('Access Denied: No token provided'));
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    socket.user = verified; // 사용자 정보를 socket 객체에 저장
    next();
  } catch (err) {
    next(new Error('Invalid Token'));
  }
};

module.exports = authenticateSocket;
