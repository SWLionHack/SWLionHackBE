const express = require('express');
const {
  createEverydayQuestion,
  getEverydayQuestion
} = require('../controllers/everydayQuestionController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const everydayQuestionRouter = express.Router();

// EverydayQuestion routes
everydayQuestionRouter.post('/everyday-question', authenticateJWT, createEverydayQuestion);
everydayQuestionRouter.get('/everyday-question', authenticateJWT, getEverydayQuestion);

module.exports = everydayQuestionRouter;
