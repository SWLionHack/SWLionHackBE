const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const UserThread = require('../../models/gpt_api/UserThreadModel');
const { getUserPosts, getUserComments, getUserDailyQuestions, getUserQnAs, getUserQuestions } = require('./userDataHelper');
const { threadId } = require('worker_threads');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const assistantID = process.env.OPENAI_ASSISTANT_ID

// 로깅 설정
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

exports.saveUserChat = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1. 사용자 데이터 수집 및 파일로 저장
    const filePath = path.join(__dirname, '../../userInfo', `${userId}.txt`);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath); // 기존 파일 삭제
    }

    const userData = await collectUserData(userId);
    await fs.promises.writeFile(filePath, userData, 'utf8');

    logger.info('Uploaded File:', filePath);

    // 2. 파일 내용을 읽어 메시지로 전달
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // 3. 기존 스레드 확인
    let userThread = await UserThread.findOne({ where: { userID: userId } });

    if (userThread) {
      // 기존 스레드가 존재하는 경우 해당 스레드 ID 사용
      logger.info('Using existing thread:', userThread.threadID);
    } else {
      // 기존 스레드가 없는 경우 새로운 스레드를 생성
      const newThread = await openai.beta.threads.create();
      userThread = await UserThread.create({
        userID: userId,
        threadID: newThread.id,
        assistantID: assistantID, // 모델 ID를 어시스턴트 ID로 저장
      });
      logger.info('Created new thread:', newThread.id);
    }

    // 4. 스레드에 첫 번째 메시지 전송
    const response = await openai.beta.threads.messages.create(userThread.threadID, {
      role: "user",
      content: `You are a personalized counselor bot for user with ID ${userId}. Analyze the following information about the user and provide empathetic and relevant advice: ${fileContent}. 대답할 때 상대방을 id로 부르지 않도록 조심해`,
    });

    logger.info('Sent message to thread:', JSON.stringify(response, null, 2));

    // 5. 응답 반환
    res.json({ response: userThread.threadID });
  } catch (error) {
    logger.error('Failed to process user data:', error);
    res.status(500).send('Failed to process user data');
  }
};

exports.continueUserChat = async (req, res) => {
  const userId = req.user.id;
  const message = req.body.message;
  const MAX_WAIT_TIME = 100000; // 최대 대기 시간 100초
  const POLLING_INTERVAL = 1000; // 폴링 간격 1초

  if (!userId || !message) {
    return res.status(400).send('User ID and message are required');
  }

  try {
    const userThread = await UserThread.findOne({ where: { userID: userId } });
    if (!userThread) {
      return res.status(404).send('No thread found for this user');
    }

    // OpenAI API에 메시지 전송
    await openai.beta.threads.messages.create(userThread.threadID, {
      role: "user",
      content: message,
    });

    console.log('메시지를 스레드에 성공적으로 추가했습니다.');

    // 어시스턴트 실행
    const runResponse = await openai.beta.threads.runs.createAndPoll(userThread.threadID, {
      assistant_id: process.env.OPENAI_ASSISTANT_ID,
    });

    console.log('어시스턴트가 실행되었습니다.');

    // 어시스턴트의 응답을 대기하면서 폴링
    const startTime = Date.now();
    let assistantResponse = null;

    while ((Date.now() - startTime) < MAX_WAIT_TIME) {
      // 스레드의 모든 메시지 가져오기
      const threadMessages = await openai.beta.threads.messages.list(userThread.threadID);

      assistantResponse = threadMessages.data.find((msg) => msg.role === "assistant");

      if (assistantResponse) {
        break; // 응답을 찾았으면 반복 종료
      }

      // 응답이 없으면 일정 시간 대기 후 다시 시도
      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    }

    if (assistantResponse) {
      // 응답이 성공적으로 도착한 경우
      console.log('Assistant response:', assistantResponse);

      const assistantMessageContent = assistantResponse.content[0]?.text?.value || '응답을 처리하는 중 오류가 발생했습니다.';
      res.json({ response: assistantMessageContent });
    } else {
      // 타임아웃이 발생한 경우
      console.error(`Failed to get a valid response for userId ${userId}`);
      res.status(500).send('Failed to get a valid response from the assistant');
    }
  } catch (error) {
    console.error(`Failed to continue chat for userId ${userId}:`, error);
    res.status(500).send('Failed to continue chat');
  }
};



exports.findUserMessage = async (req, res) => {
  const userId = req.user.id;

  try {
    // 데이터베이스에서 사용자의 스레드 ID를 조회
    const userThread = await UserThread.findOne({ where: { userID: userId } });

    if (!userThread) {
      return res.json({ threadID: null, messages: [] });
    }

    console.log('Using Thread ID:', userThread.threadID);

    // OpenAI API를 통해 해당 스레드의 메시지 조회
    //const threadMessages = await openai.beta.threads.messages.list(userThread.threadID);

    res.json({ threadID: userThread.threadID, messages: threadMessages.data });
  } catch (error) {
    console.error(`Failed to retrieve messages for userId ${userId}:`, error);
    res.status(500).send('Failed to retrieve messages');
  }
};

// 사용자 데이터를 수집하는 함수
async function collectUserData(userId) {
  const userPosts = await getUserPosts(userId);
  const userComments = await getUserComments(userId);
  const userDailyQuestions = await getUserDailyQuestions(userId);
  const userQnAs = await getUserQnAs(userId);
  const userQuestions = await getUserQuestions(userId);

  return `
    User Posts:
    ${userPosts.map(post => `Title: ${post.title}\nContent: ${post.content}`).join('\n\n')}

    User Comments:
    ${userComments.map(comment => `Content: ${comment.content}`).join('\n\n')}

    User Daily Questions:
    ${userDailyQuestions.map(dq => `Question: ${dq.title}\nAnswer: ${dq.content}`).join('\n\n')}

    User QnAs:
    ${userQnAs.map(qna => `Title: ${qna.title}\nContent: ${qna.content}`).join('\n\n')}

    User Questions:
    ${userQuestions.map(question => `Title: ${question.title}\nContent: ${question.content}`).join('\n\n')}
  `;
}
