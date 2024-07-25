const express = require('express');
const { getLoginPage, getSignUpPage, login, signUp, protectedRoute, logOut } = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware'); // 인증 미들웨어 경로 확인
const getExperts = require('../controllers/expertController')

const router = express.Router();

router.get('/login', getLoginPage);
router.get('/sign-up', getSignUpPage);
router.post('/login', login);
router.post('/sign-up', signUp);
router.post('/logout', logOut);
router.get('/protected', authenticateJWT, protectedRoute);
router.get('/experts', getExperts)

module.exports = router;
