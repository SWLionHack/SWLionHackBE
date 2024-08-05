const SurveyResult = require('../models/survey');

exports.submitSurvey = async (req, res) => {
  const userId = req.user.id; // 로그인한 사용자의 ID
  const answers = req.body.answers;  // 프론트엔드에서 받은 답변 배열
  let score = 0;

  // 설문 점수 계산
  for (let answer of answers) {
    score += answer;
  }

  let result = '';
  if (score <= 8) {
    result = '정상';
  } else if (score <= 12) {
    result = '상담 필요';
  } else {
    result = '심각한 산후우울증';
  }

  try {
    // 사용자가 이미 설문 결과를 제출했는지 확인
    let surveyResult = await SurveyResult.findOne({ where: { userId: userId } });

    if (surveyResult) {
      // 기존 결과가 있으면 업데이트
      surveyResult.score = score;
      surveyResult.result = result;
      await surveyResult.save();
    } else {
      // 기존 결과가 없으면 새로 생성
      surveyResult = await SurveyResult.create({
        userId: userId,
        score: score,
        result: result
      });
    }

    res.status(201).json({
      score: surveyResult.score,
      result: surveyResult.result
    });
  } catch (error) {
    console.error('Error while saving survey result:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};


exports.getSurveyResults = async (req, res) => {
  try {
    const surveyResults = await SurveyResult.findAll();
    res.status(200).json(surveyResults);
  } catch (error) {
    console.error('Error while fetching survey results:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// const SurveyAnswer = require('../models/surveyAnswer');
// const Survey = require('../models/survey');
// const Question = require('../models/surveyQuestion');

// // 설문 제목 목록 가져오기
// exports.getSurveys = async (req, res) => {
//   try {
//     // 고정된 설문 제목 목록
//     const surveys = [
//       { id: 1, title: '스트레스 검사' },
//       { id: 2, title: '적성검사' },
//       { id: 3, title: '우울증 검사' },
//       { id: 4, title: '화내기 유형 검사' },
//       { id: 5, title: '사회 불안 검사' }
//     ];
    
//     // JSON 형식으로 응답
//     res.json(surveys);
//   } catch (error) {
//     console.error('Error fetching surveys:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };






// // 특정 설문에 대한 질문 가져오기
// //질문은 데이터베이스에 넣어야함.//mysql에
// exports.getSurveyQuestions = async (req, res) => {
//   try {
//     const surveyId = req.params.surveyId; // 요청에서 surveyId를 가져옵니다.
//     const surveyIdInt = parseInt(surveyId, 10); // surveyId를 정수로 변환합니다.

//     if (isNaN(surveyIdInt)) {
//       return res.status(400).json({ error: 'Invalid surveyId' }); // 유효성 검사를 추가합니다.
//     }

//     const questions = await Question.findAll({
//       where: { surveyId: surveyIdInt },
//     });

//     res.json(questions);
//   } catch (error) {
//     console.error('Error fetching survey questions:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// /*
// // 특정 설문에 대한 질문 가져오기
// exports.getSurveyQuestions = async (req, res) => {
//   try {
//     const { surveyId } = req.params;
//     const surveyIdInt = parseInt(surveyId, 10); // 정수로 변환
//     const questions = await Question.findAll({ where: { surveyId: surveyIdInt } });
    
//     res.json(questions);
//   } catch (error) {
//     console.error('Error fetching survey questions:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// };
// */


// // 설문 답변 제출
// exports.submitSurvey = async (req, res) => {
//   try {
//     const surveyId = parseInt(req.params.survey_id, 10);
//     const { questionId, answer } = req.body;

//     console.log('Survey ID:', surveyId);
//     console.log('Question ID:', questionId);
//     console.log('Answer:', answer);

//     // 데이터 유효성 검사
//     if (isNaN(surveyId) || !questionId || !answer) {
//       return res.status(400).send('Missing required fields or invalid surveyId');
//     }

//     // 데이터베이스에 새로운 레코드 생성
//     await SurveyAnswer.create({
//       surveyId,
//       questionId,
//       answer,
//     });

//     res.status(200).send('Survey answer submitted successfully');
//   } catch (error) {
//     console.error('Error submitting survey answer:', error);
//     res.status(500).send('Internal Server Error');
//   }
// };



// //설문 답변 데이터 불러오기
// exports.getSurveyAnswers = async (req, res) => {
//   try {
//     const surveyId = parseInt(req.params.survey_id, 10);

//     if (isNaN(surveyId)) {
//       return res.status(400).send('Invalid surveyId');
//     }

//     // 설문 ID에 해당하는 모든 답변을 조회
//     const answers = await SurveyAnswer.findAll({
//       where: {
//         surveyId
//       }
//     });

//     // 결과를 클라이언트에 반환
//     res.status(200).json(answers);
//   } catch (error) {
//     console.error('Error fetching survey answers:', error);
//     res.status(500).send('Internal Server Error');
//   }
// };
