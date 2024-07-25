const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const answerController = require('../controllers/answerController');

// 특정 게시글에 달린 모든 댓글 조회
router.get('/questions/:questionID/answers', answerController.getAnswersByQuestionId);

// 댓글 작성
router.post('/questions/:questionID/answers', authenticateJWT, answerController.createAnswer);

// 댓글 삭제
router.delete('/answers/:answerID', authenticateJWT, answerController.deleteAnswer);

module.exports = router;