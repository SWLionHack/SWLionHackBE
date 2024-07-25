const SurveyAnswer = require('../models/surveyAnswer');
const Survey = require('../models/survey');
const Question = require('../models/question');

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
/*
// 특정 설문에 대한 질문 가져오기
exports.getSurveyQuestions = async (req, res) => {
  try {
    const { surveyId } = req.params;
    const surveyIdInt = parseInt(surveyId, 10); // 정수로 변환
    const questions = await Question.findAll({ where: { surveyId: surveyIdInt } });
    
    res.json(questions);
  } catch (error) {
    console.error('Error fetching survey questions:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
*/


// 설문 답변 제출
exports.submitSurvey = async (req, res) => {
  try {
    const surveyId = parseInt(req.params.survey_id, 10);
    const { questionId, answer } = req.body;

    console.log('Survey ID:', surveyId);
    console.log('Question ID:', questionId);
    console.log('Answer:', answer);

    // 데이터 유효성 검사
    if (isNaN(surveyId) || !questionId || !answer) {
      return res.status(400).send('Missing required fields or invalid surveyId');
    }

    // 데이터베이스에 새로운 레코드 생성
    await SurveyAnswer.create({
      surveyId,
      questionId,
      answer,
    });

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






/*
// 설문 질문 생성 (추가된 부분)
exports.getQuestions = async (req, res) => {
  try {
    const surveyId = req.params.id;
    const { questionId, answer } = req.body;

    if (!surveyId || !questionId || !answer) {
      return res.status(400).send('Missing required fields');
    }

    await SurveyAnswer.create({
      surveyId,
      questionId,
      answer,
    });

    res.status(200).send('Survey data submitted successfully');
  } catch (error) {
    console.error('Error submitting survey:', error);
    res.status(500).send('Internal Server Error');
  }
};




// controllers/surveyController.js
/*
const Question = require('../models/survey/question');
const AnswerOption = require('../models/survey/answer');
const Response = require('../models/survey/Response');

// 질문 추가
// controllers/surveyController.js
exports.addQuestion = async (req, res) => {
  const questions = req.body; // 요청 본문이 배열일 것으로 가정
  if (!Array.isArray(questions)) {
    return res.status(400).json({ error: 'Expected an array of questions' });
  }
  
  try {
    const createdQuestions = await Promise.all(
      questions.map(question => {
        if (!question.question_text) {
          throw new Error('Question text is required');
        }
        return Question.create({ question_text: question.question_text });
      })
    );
    res.status(201).json(createdQuestions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 답변 옵션 추가
exports.addAnswerOption = async (req, res) => {
  try {
    const option = await AnswerOption.create({ option_text: req.body.option_text });
    res.status(201).json(option);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 응답 저장
exports.saveResponse = async (req, res) => {
  try {
    const response = await Response.create({
      question_id: req.body.question_id,
      answer_option_id: req.body.answer_option_id
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 질문과 답변 옵션을 반환하는 API

exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      include: [{ model: AnswerOption }]
    });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).send('Error fetching questions');
  }
};

const { AnswerOption } = require('../models');

const getQuestions = async (req, res) => {
  try {
    const questions = await Question.findAll({
      include: [{
        model: AnswerOption,
        as: 'AnswerOptions'
      }]
    });
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
};

module.exports = {
  getQuestions
};
*/
