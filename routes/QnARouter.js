// routes/QnARouter.js
const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const qnaController = require('../controllers/qnaController');

// QnA 생성 API
router.post('/create', authenticateJWT, qnaController.createQnA);

// QnA 투표 API
router.post('/vote/:qnaID', authenticateJWT, qnaController.voteQnA);

// 만료된 QnA 조회 API
router.get('/expired', authenticateJWT, qnaController.getExpiredQnAs);

// QnA 삭제 API
router.delete('/:qnaID', authenticateJWT, qnaController.deleteQnA);

// 진행 중인 QnA 조회 API
router.get('/active-titles', authenticateJWT, qnaController.getActiveQnATitlesAndExpiration);

// 특정 QnA 정보 조회 API
router.get('/:qnaID', authenticateJWT, qnaController.getQnADetails);

module.exports = router;
