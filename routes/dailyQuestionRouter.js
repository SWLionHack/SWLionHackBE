const express = require('express');
const {
  createDailyQuestion,
  getAllDailyQuestions,
  getCurrentEverydayQuestionWithUserAnswer,
  getSharedAnswers,
  addLike
} = require('../controllers/dailyQuestionController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const dailyQuestionRouter = express.Router();

// 오늘의 질문 및 사용자의 답변 가져오기
dailyQuestionRouter.get('/daily-questions/my-answer', authenticateJWT, getCurrentEverydayQuestionWithUserAnswer);

// 질문에 대한 답변 저장
dailyQuestionRouter.post('/daily-questions', authenticateJWT, createDailyQuestion);

// 모든 질문 가져오기
dailyQuestionRouter.get('/daily-questions/all', authenticateJWT, getAllDailyQuestions);

// 공유된 답변 가져오기
dailyQuestionRouter.get('/daily-questions/shared', authenticateJWT, getSharedAnswers);

// 좋아요 추가
dailyQuestionRouter.post('/daily-questions/:id/like', authenticateJWT, addLike);

module.exports = dailyQuestionRouter;
