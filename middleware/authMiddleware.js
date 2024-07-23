const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); // 쿠키 파서 추가

const JWT_SECRET = process.env.JWT_SECRET || 'JWT_TOKEN';

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.token; // 쿠키에서 토큰 추출

  if (!token) {
    return res.status(401).send('Access Denied: No token provided');
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = { authenticateJWT };
