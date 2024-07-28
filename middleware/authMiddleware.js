const jwt = require('jsonwebtoken');

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

const checkNotAuthenticated = (req, res, next) => {
  const token = req.cookies.token;

  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);
      return res.status(403).send('Already logged in');
    } catch (err) {
      // 토큰이 유효하지 않으면 로그인 페이지로 접근 허용
      next();
    }
  } else {
    next();
  }
};

module.exports = { authenticateJWT, checkNotAuthenticated };
