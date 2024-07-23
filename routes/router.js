const express = require('express');
const { getLoginPage, getSignUpPage, login, signUp, protectedRoute, UserInfo, logout } = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware'); // 인증 미들웨어 경로 확인

const router = express.Router();

router.get('/login', getLoginPage);
router.get('/sign-up', getSignUpPage);
router.post('/login', login);
router.post('/sign-up', signUp);
router.get('/protected', authenticateJWT, protectedRoute);
router.get('/info', authenticateJWT, UserInfo); // 새로운 경로 추가
router.post('/logout', logout); // 로그아웃 경로 추가

module.exports = router;
