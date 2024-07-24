const express = require('express');
const {
  createDiary,
  updateDiary,
  deleteDiary,
  checkDiary,
  allDiaries
} = require('../controllers/diaryController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const diaryRouter = express.Router();

// Diary routes
diaryRouter.post('/diaries', authenticateJWT, createDiary);
diaryRouter.put('/diaries/:id', authenticateJWT, updateDiary);
diaryRouter.delete('/diaries/:id', authenticateJWT, deleteDiary);
diaryRouter.get('/diaries/:id', authenticateJWT, checkDiary);
diaryRouter.get('/diaries', authenticateJWT, allDiaries);

module.exports = diaryRouter;
