const express = require('express');
const router = express.Router();
const surveyController = require('../controllers/surveyController');

console.log("surveyController loaded:", surveyController);

// 설문 제목 목록 가져오기
router.get('/surveys', surveyController.getSurveys);

// 특정 설문에 대한 질문 가져오기
router.get('/survey/:surveyId', surveyController.getSurveyQuestions);

// 설문 답변 제출//데이터베이스에 저장만 하는 기능
router.post('/survey/:survey_id/submit', surveyController.submitSurvey);

// 설문 답변 조회 API
router.get('/survey/:survey_id/answers', surveyController.getSurveyAnswers);


module.exports = router;



// 설문 질문을 데이터베이스에 저장하는 코드
//router.post('/survey/:id/create', surveyController.getQuestions);