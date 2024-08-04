const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const postController = require('../controllers/postController');

// 게시글 제목 조회
// /posts/titles?category=sales&&page=1
router.get('/posts/titles', authenticateJWT, postController.getAllPostTitles);

// 특정 게시글 조회
router.get('/posts/:postID', authenticateJWT, postController.getPostById);

// 게시글 작성
router.post('/posts/create', authenticateJWT, postController.createPost);

// 게시글 삭제
router.delete('/posts/:postID', authenticateJWT, postController.deletePost);

module.exports = router;