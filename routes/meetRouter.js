const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const meetController = require('../controllers/meetController');

// Meet 생성 API
router.post('/create', authenticateJWT, meetController.createMeet);

// Meet 투표 API
router.post('/vote/:meetID', authenticateJWT,  meetController.voteMeet);

// 만료된 Meet 조회 API
router.get('/expired', authenticateJWT,  meetController.getExpiredMeets);

// QnA Meet API
router.delete('/:meetID', authenticateJWT,  meetController.deleteMeet);

// 진행 중인 Meet 조회 API
router.get('/active-titles', authenticateJWT,  meetController.getActiveMeetTitlesAndExpiration);

// 특정 Meet 정보 조회 API
router.get('/:meetID', authenticateJWT,  meetController.getMeetDetails);

module.exports = router;
