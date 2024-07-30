const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const { getAcademyByName, addReview, getAcademyRatings } = require('../controllers/map_academyController');

// 학원 이름으로 정보 가져오기
router.get('/:Academyname', authenticateJWT, getAcademyByName);

// 리뷰 추가하기
router.post('/review', authenticateJWT, addReview);

// 학원 이름 배열로 별점 조회
router.post('/ratings', authenticateJWT, getAcademyRatings);

module.exports = router;
