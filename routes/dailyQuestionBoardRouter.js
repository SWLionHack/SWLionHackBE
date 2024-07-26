const express = require('express');
const { getDailyQuestionBoard, shareDailyQuestion, likeDailyQuestion } = require('../controllers/dailyQuestionBoardController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const dailyQuestionBoardRouter = express.Router();

dailyQuestionBoardRouter.get('/daily-question-board', authenticateJWT, getDailyQuestionBoard);
dailyQuestionBoardRouter.post('/share/:id', authenticateJWT, shareDailyQuestion);
dailyQuestionBoardRouter.post('/like/:dailyQuestionId', authenticateJWT, likeDailyQuestion);

module.exports = dailyQuestionBoardRouter;
