const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const surveyController = require('../controllers/surveyController');

router.post('/submit', authenticateJWT, surveyController.submitSurvey);
router.get('/results', authenticateJWT, surveyController.getSurveyResults);  // 저장된 설문 결과를 불러오는 엔드포인트

module.exports = router;

