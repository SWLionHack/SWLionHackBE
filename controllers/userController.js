const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'JWT_TOKEN';

// 로그인 페이지 제공
const getLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../template/login.html'));
};

// 회원가입 페이지 제공
const getSignUpPage = (req, res) => {
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

    const token = jwt.sign({ id: user.id, email: user.email, status: user.status }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: '로그인이 완료되었습니다.', token });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
};

// 회원가입 처리
const signUp = async (req, res) => {
  console.log(req.body); // 요청 본문 출력

  const { name, phone, status, email, password, confirmPassword } = req.body;

  // 필수 정보가 모두 있는지 확인
  if (!name || !phone || !email || !password || !confirmPassword ||!status) {
    return res.status(400).send('정보를 모두 입력하세요');
  }

  // 비밀번호 확인
  if (password !== confirmPassword) {
    return res.status(400).send('비밀번호가 일치하지 않습니다');
  }

<<<<<<< HEAD
  // status 변환
  let convertedStatus;
  if (status === 'parent') {
    convertedStatus = 'parent';
  } else if (status === '자녀') {
    convertedStatus = 'child';
  } else {
    return res.status(400).send('올바른 상태 값을 입력하세요');
  }

=======
>>>>>>> login
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
    const newUser = await User.create({ name, phone, email, password: hashedPassword, status });
    console.log('New user created:', newUser);
    return res.status(201).send('회원가입이 완료되었습니다.');
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal server error');
  }
};

// 보호된 경로
const protectedRoute = (req, res) => {
  res.status(200).send('This is a protected route');
};

module.exports = {
  getLoginPage,
  getSignUpPage,
  login,
  signUp,
  protectedRoute
};
