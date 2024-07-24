const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const commentController = require('../controllers/commentController');

// 특정 게시글에 달린 모든 댓글 조회
router.get('/posts/:postID/comments', commentController.getCommentsByPostId);

// 댓글 작성
router.post('/posts/:postID/comments', authenticateJWT, commentController.createComment);

// 댓글 삭제
router.delete('/comments/:commentID', authenticateJWT, commentController.deleteComment);

module.exports = router;