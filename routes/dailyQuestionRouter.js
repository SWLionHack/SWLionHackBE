const express = require('express');
const {
  createDailyQuestion,
  getAllDailyQuestions,
  getCurrentEverydayQuestion
} = require('../controllers/dailyQuestionController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const dailyQuestionRouter = express.Router();

// DailyQuestion routes
dailyQuestionRouter.post('/daily-questions', authenticateJWT, createDailyQuestion);
dailyQuestionRouter.get('/daily-questions/all', authenticateJWT, getAllDailyQuestions);
dailyQuestionRouter.get('/daily-questions', authenticateJWT, getCurrentEverydayQuestion);

module.exports = dailyQuestionRouter;
