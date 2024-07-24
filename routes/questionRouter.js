const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const questionController = require('../controllers/questionController');

// 모든 게시글 조회
router.get('/questions', questionController.getAllQuestions);

// 특정 게시글 조회
router.get('/questions/:questionID', questionController.getQuestionById);

// 게시글 작성
router.post('/questions/create', authenticateJWT, questionController.createQuestion);

// 게시글 수정
router.post('/questions/:questionID/update', authenticateJWT, questionController.updateQuestion);

// 게시글 삭제
router.delete('/questions/:questionID/delete', authenticateJWT, questionController.deleteQuestion);

module.exports = router;
