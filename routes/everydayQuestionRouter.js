const express = require('express');
const {
  createEverydayQuestion,
  getEverydayQuestion
} = require('../controllers/everydayQuestionController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const everydayQuestionRouter = express.Router();

// EverydayQuestion routes

// 새로운 질문을 생성하는 경로
// 경로: POST /everyday-question
// 인증된 사용자가 요청해야 하며, 요청 본문에 question을 포함해야 함
everydayQuestionRouter.post('/everyday-question', authenticateJWT, createEverydayQuestion);

// 현재 설정된 질문을 조회하는 경로
// 경로: GET /everyday-question
// 인증된 사용자가 요청해야 함
everydayQuestionRouter.get('/everyday-question', authenticateJWT, getEverydayQuestion);

module.exports = everydayQuestionRouter;
