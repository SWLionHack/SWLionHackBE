const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// 모든 게시글 조회
router.get('/posts', postController.getAllPosts);

// 특정 게시글 조회
router.get('/posts/:postID', postController.getPostById);

// 게시글 작성
router.post('/posts/create', postController.createPost);

// 게시글 수정
router.put('/posts/:postID', postController.updatePost);

// 게시글 삭제
router.delete('/posts/:postID', postController.deletePost);

module.exports = router;
