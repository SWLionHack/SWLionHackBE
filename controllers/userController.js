const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;


// 로그인 페이지 제공
const loginPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../template/login.html'));
};

// 회원가입 페이지 제공
const signUpPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../template/sign-up.html'));
};

// 로그인 처리
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).send('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).send('이메일 또는 비밀번호가 잘못되었습니다.');
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, status: user.status }, JWT_SECRET, { expiresIn: '24h' });

    // JWT 토큰을 쿠키에 저장
    res.cookie('token', token, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production' ? true : false // 개발 환경에서는 false, 배포 환경에서는 true
    });

    return res.status(200).json({ message: '로그인이 완료되었습니다.', token });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
};

// 회원가입 처리
const signUp = async (req, res) => {
  console.log(req.body); // 요청 본문 출력

  const { name, phone, birthdate, email, password, confirmPassword } = req.body;

  const status = "teen"

  // 필수 정보가 모두 있는지 확인
  if (!name || !phone || !email || !password || !confirmPassword || !status || !birthdate) {
    return res.status(400).send('정보를 모두 입력하세요');
  }

  // 비밀번호 확인
  if (password !== confirmPassword) {
    return res.status(400).send('비밀번호가 일치하지 않습니다');
  }

  try {
    // 이메일 또는 전화번호 중복 확인
    const existingUser = await User.findOne({ where: { [Op.or]: [{ email }, { phone }] } });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).send('이미 사용 중인 이메일입니다.');
      } else if (existingUser.phone === phone) {
        return res.status(400).send('이미 사용 중인 전화번호입니다.');
      }
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const newUser = await User.create({ name, phone, email, password: hashedPassword, status, birthdate });
    console.log('New user created:', newUser);
    return res.status(201).send('회원가입이 완료되었습니다.');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: '로그아웃이 완료되었습니다.' });
};

// 보호된 경로
const protectedRoute = (req, res) => {
  res.status(200).send('This is a protected route');
};

// 사용자 정보 제공
const userInfo = async (req, res) => {
  try {
    const userId = req.user.id; // 인증 미들웨어를 통해 설정된 사용자 ID
    const user = await User.findByPk(userId, { attributes: ['name', 'phone', 'email', 'password'] });

    if (!user) {
      return res.status(404).send('사용자를 찾을 수 없습니다.');
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  loginPage,
  signUpPage,
  login,
  signUp,
  logout,
  protectedRoute,
  userInfo
};
