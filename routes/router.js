const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // jsonwebtoken 패키지 추가
const { Op } = require('sequelize');
const User = require('../models/User'); // User 모델 파일 경로

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // JWT 비밀 키 설정

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../template/login.html'));
});

// 회원가입 페이지 제공
router.get('/sign-up', (req, res) => {
  res.sendFile(path.join(__dirname, '../template/sign-up.html'));
});

// 로그인 처리
router.post('/login', async function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  try {
    // 사용자가 존재하는지 확인
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(400).send('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    // 비밀번호 확인
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    // 로그인 성공 -> JWT 생성
    const token = jwt.sign({ id: user.id, email: user.email, status: user.status }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: '로그인이 완료되었습니다.', token: token });
  } catch (err) {
    console.error(err);
    // 기타 오류 처리
    return res.status(500).send('Internal server error');
  }
});

// 회원가입 처리
router.post('/sign-up', async function(req, res) {
  const name = req.body.Name;
  const phone = req.body.phone;
  const status = Array.isArray(req.body.status) ? req.body.status[0] : req.body.status;
  const email = req.body.email;
  const password = req.body.psw;
  const confirmPassword = req.body.cPsw;

  // 모두 입력 안하는 경우
  if (!name || !phone || !email || !password || !confirmPassword) {
    return res.status(400).send('정보를 모두 입력하세요');
  }

  // 비밀번호가 다른 경우
  if (password !== confirmPassword) {
    return res.status(400).send('비밀번호가 일치하지 않습니다');
  }

  try {
    // 이메일 또는 전화번호 중복 확인
    const existingUser = await User.findOne({ where: { [Op.or]: [{ email: email }, { phone: phone }] } });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).send('이미 사용 중인 이메일입니다.');
      } else if (existingUser.phone === phone) {
        return res.status(400).send('이미 사용 중인 전화번호입니다.');
      }
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // db저장
    const newUser = await User.create({ name, phone, email, password: hashedPassword, status: status });
    console.log('New user created:', newUser);
    return res.status(201).send('회원가입이 완료되었습니다.');
  } catch (err) {
    console.error(err);
    // 기타 오류 처리
    return res.status(500).send('Internal server error');
  }
});

// 인증 미들웨어 추가
const authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Authorization 헤더에서 토큰 추출

  if (!token) {
    return res.status(401).send('Access Denied');
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // 토큰 검증 후 사용자 정보 저장
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

// JWT 인증이 필요한 엔드포인트 예시
router.get('/protected', authenticateJWT, (req, res) => {
  res.status(200).send('This is a protected route');
});

module.exports = { router, authenticateJWT };
