const express = require('express');
const router = express.Router();
const gptUserController = require('../../controllers/gpt_api/gptUserController');
const { authenticateJWT } = require('../../middleware/authMiddleware');

// 대화 시작
router.post('/chat', authenticateJWT, gptUserController.saveUserChat);

// 대화 이어가기
router.post('/chat/continue', authenticateJWT, gptUserController.continueUserChat);

// 대화 기록 조회
router.get('/chat', authenticateJWT, gptUserController.findUserMessage);

module.exports = router;
