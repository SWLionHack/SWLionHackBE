const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');
const { authenticateJWT } = require('../middleware/authMiddleware');

// 모든 일기 조회
router.get('/all', authenticateJWT, diaryController.getAllDiaries);

// 새 일기 작성
router.post('/new', authenticateJWT,diaryController.createDiary);

// 특정 일기 조회
router.get('/:id', authenticateJWT, diaryController.getDiaryById);

module.exports = router;
