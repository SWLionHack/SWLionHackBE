const express = require('express');
const multer = require('multer');
const {
  createDailyQuestion,
  getAllDailyQuestions,
  getCurrentEverydayQuestionWithUserAnswer,
  getSharedAnswers,
  addLike
} = require('../controllers/dailyQuestionController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const dailyQuestionRouter = express.Router();


// Multer 설정: 파일을 업로드할 위치와 파일명 지정
const upload = multer({ dest: 'uploads/' }); 

// 오늘의 질문 및 사용자의 답변 가져오기
dailyQuestionRouter.get('/daily-questions/my-answer', authenticateJWT, getCurrentEverydayQuestionWithUserAnswer);

// 질문에 대한 답변 저장
dailyQuestionRouter.post('/daily-questions', authenticateJWT, upload.single('image'), createDailyQuestion);

// 모든 질문 가져오기
dailyQuestionRouter.get('/daily-questions/all', authenticateJWT, getAllDailyQuestions);

// 공유된 답변 가져오기
dailyQuestionRouter.get('/daily-questions/shared', authenticateJWT, getSharedAnswers);

// 좋아요 추가
dailyQuestionRouter.post('/daily-questions/:id/like', authenticateJWT, addLike);

module.exports = dailyQuestionRouter;
