const SurveyAnswer = require('../models/surveyAnswer');
const Question = require('../models/surveyQuestions');

// 설문 제목 목록 가져오기
exports.getSurveys = async (req, res) => {
  try {
    // 고정된 설문 제목 목록
    const surveys = [
      { id: 1, title: '스트레스 검사' },
      { id: 2, title: '적성검사' },
      { id: 3, title: '우울증 검사' },
      { id: 4, title: '화내기 유형 검사' },
      { id: 5, title: '사회 불안 검사' }
    ];
    
    // JSON 형식으로 응답
    res.json(surveys);
  } catch (error) {
    console.error('Error fetching surveys:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 특정 설문에 대한 질문 가져오기
//질문은 데이터베이스에 넣어야함.//mysql에
exports.getSurveyQuestions = async (req, res) => {
  try {
    const surveyId = req.params.surveyId; // 요청에서 surveyId를 가져옵니다.
    const surveyIdInt = parseInt(surveyId, 10); // surveyId를 정수로 변환합니다.

    if (isNaN(surveyIdInt)) {
      return res.status(400).json({ error: 'Invalid surveyId' }); // 유효성 검사를 추가합니다.
    }

    const questions = await Question.findAll({
      where: { surveyId: surveyIdInt },
    });

    res.json(questions);
  } catch (error) {
    console.error('Error fetching survey questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 설문 답변 제출
exports.submitSurvey = async (req, res) => {
  try {
    const surveyId = parseInt(req.params.survey_id, 10);
    const answers = req.body; // 여러 답변을 받을 수 있도록 배열을 기대합니다.

    console.log('Survey ID:', surveyId);
    console.log('Answers:', answers);

    // 데이터 유효성 검사
    if (isNaN(surveyId) || !Array.isArray(answers) || answers.some(answer => !answer.questionId || !answer.answer)) {
      return res.status(400).send('Missing required fields or invalid surveyId');
    }

    // 데이터베이스에 새로운 레코드 생성
    await Promise.all(answers.map(async (answer) => {
      await SurveyAnswer.create({
        surveyId,
        questionId: answer.questionId,
        answer: answer.answer,
      });
    }));

    res.status(200).send('Survey answer submitted successfully');
  } catch (error) {
    console.error('Error submitting survey answer:', error);
    res.status(500).send('Internal Server Error');
  }
};

//설문 답변 데이터 불러오기
exports.getSurveyAnswers = async (req, res) => {
  try {
    const surveyId = parseInt(req.params.survey_id, 10);

    if (isNaN(surveyId)) {
      return res.status(400).send('Invalid surveyId');
    }

    // 설문 ID에 해당하는 모든 답변을 조회
    const answers = await SurveyAnswer.findAll({
      where: {
        surveyId
      }
    });

    // 결과를 클라이언트에 반환
    res.status(200).json(answers);
  } catch (error) {
    console.error('Error fetching survey answers:', error);
    res.status(500).send('Internal Server Error');
  }
};
