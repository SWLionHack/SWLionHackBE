const bcrypt = require('bcrypt');
const User = require('./models/User');
const Expert = require('./models/Expert');
const Post = require('./models/postModel');
const Comment = require('./models/commentModel');
const Question = require('./models/questionModel');
const Answer = require('./models/answerModel');
const OpenChatRoom = require('./models/chat/OpenChatRoom');
const EverydayQuestion = require('./models/daily_question/EverydayQuestion');
const DailyQuestion = require('./models/daily_question/DailyQuestion');

const insertMockData = async () => {
  try {
    // 사용자 데이터 삽입
    const users = await User.bulkCreate([
      { name: 'Alice3', phone: '010-1111-1111', email: '123@gmail.com', password: await bcrypt.hash('123', 10), status: "teen", birthdate: new Date('2006-01-01') },
      { name: 'Bob3', phone: '010-2222-2222', email: '456@gmail.com', password: await bcrypt.hash('456', 10), status: "teen", birthdate: new Date('2007-01-01') },
      { name: 'Charlie3', phone: '010-3333-3333', email: '789@gmail.com', password: await bcrypt.hash('789', 10), status: "teen", birthdate: new Date('2008-01-01') },
      { name: 'David', phone: '010-4444-4444', email: 'david@gmail.com', password: await bcrypt.hash('password4', 10), status: "teen", birthdate: new Date('2005-01-01') },
      { name: 'Emma', phone: '010-5555-5555', email: 'emma@gmail.com', password: await bcrypt.hash('password5', 10), status: "teen", birthdate: new Date('2005-01-01') },
      { name: 'Frank', phone: '010-6666-6666', email: 'frank@gmail.com', password: await bcrypt.hash('password6', 10), status: "teen", birthdate: new Date('2007-01-01') },
      { name: 'Grace', phone: '010-7777-7777', email: 'grace@gmail.com', password: await bcrypt.hash('password7', 10), status: "teen", birthdate: new Date('2006-01-01') },
      { name: 'Hank', phone: '010-8888-8888', email: 'hank@gmail.com', password: await bcrypt.hash('password8', 10), status: "teen", birthdate: new Date('2008-01-01') },
      { name: 'Ivy', phone: '010-9999-9999', email: 'ivy@gmail.com', password: await bcrypt.hash('password9', 10), status: "teen", birthdate: new Date('2006-01-01') },
      { name: 'Jack', phone: '010-0000-0000', email: 'jack@gmail.com', password: await bcrypt.hash('password10', 10), status: "teen", birthdate: new Date('2005-01-01') }
    ]);
    console.log('User mock data inserted');

    // 전문가 데이터 삽입
    await Expert.bulkCreate([
      { name: 'Dr. John Doe', phone: '010-4444-4444', email: 'john.doe@example.com', password: await bcrypt.hash('password1', 10), specialization: "청소년 심리학" },
      { name: 'Dr. Jane Smith', phone: '010-5555-5555', email: 'jane.smith@example.com', password: await bcrypt.hash('password2', 10), specialization: "정신건강" },
      { name: 'Dr. Emily Johnson', phone: '010-6666-6666', email: 'emily.johnson@example.com', password: await bcrypt.hash('password3', 10), specialization: "청소년 상담" },
    ]);
    console.log('Expert mock data inserted');

    // 게시물 데이터 삽입
    const posts = await Post.bulkCreate([
      { author: 1, status: 'teen', title: '가장 좋아하는 게임은 무엇인가요?', content: '저는 롤을 정말 좋아해요. 여러분은 어떤 게임을 좋아하나요?', createdAt: new Date() },
      { author: 2, status: 'teen', title: '학교에서 가장 좋아하는 과목은?', content: '저는 과학을 좋아해요. 여러분은 어떤 과목을 좋아하나요?', createdAt: new Date() },
      { author: 3, status: 'teen', title: '친구들과의 추억을 공유해봐요', content: '여러분은 친구들과 어떤 추억이 있나요? 저는 캠핑 갔던 기억이 가장 좋아요.', createdAt: new Date() },
      { author: 4, status: 'teen', title: '가장 좋아하는 영화는 무엇인가요?', content: '저는 인셉션이라는 영화를 가장 좋아해요. 여러분은 어떤 영화를 좋아하나요?', createdAt: new Date() },
      { author: 5, status: 'teen', title: '어떤 운동을 좋아하시나요?', content: '저는 축구를 좋아해요. 여러분은 어떤 운동을 좋아하나요?', createdAt: new Date() },
      { author: 6, status: 'teen', title: '가장 좋아하는 음악 장르는?', content: '저는 K-POP을 좋아해요. 여러분은 어떤 음악을 좋아하나요?', createdAt: new Date() },
      { author: 7, status: 'teen', title: '휴일에는 무엇을 하나요?', content: '저는 주로 독서를 해요. 여러분은 휴일에 무엇을 하나요?', createdAt: new Date() },
      { author: 8, status: 'teen', title: '가장 좋아하는 음식은?', content: '저는 피자를 좋아해요. 여러분은 어떤 음식을 좋아하나요?', createdAt: new Date() },
      { author: 9, status: 'teen', title: '가장 기억에 남는 여행지는?', content: '저는 제주도가 가장 기억에 남아요. 여러분은 어떤 여행지가 기억에 남나요?', createdAt: new Date() },
      { author: 10, status: 'teen', title: '미래의 꿈은 무엇인가요?', content: '저는 의사가 되고 싶어요. 여러분의 미래의 꿈은 무엇인가요?', createdAt: new Date() },
      { author: 1, status: 'teen', title: '좋아하는 취미는 무엇인가요?', content: '저는 그림 그리기가 취미에요. 여러분의 취미는 무엇인가요?', createdAt: new Date() },
      { author: 2, status: 'teen', title: '가장 좋아하는 계절은?', content: '저는 봄이 가장 좋아요. 여러분은 어떤 계절을 좋아하나요?', createdAt: new Date() },
      { author: 3, status: 'teen', title: '가장 좋아하는 색깔은?', content: '저는 파란색을 좋아해요. 여러분은 어떤 색깔을 좋아하나요?', createdAt: new Date() },
      { author: 4, status: 'teen', title: '좋아하는 동물은?', content: '저는 강아지를 좋아해요. 여러분은 어떤 동물을 좋아하나요?', createdAt: new Date() },
      { author: 5, status: 'teen', title: '좋아하는 과일은?', content: '저는 딸기를 좋아해요. 여러분은 어떤 과일을 좋아하나요?', createdAt: new Date() },
      { author: 6, status: 'teen', title: '좋아하는 스포츠는?', content: '저는 야구를 좋아해요. 여러분은 어떤 스포츠를 좋아하나요?', createdAt: new Date() },
      { author: 7, status: 'teen', title: '좋아하는 과자는?', content: '저는 초콜릿을 좋아해요. 여러분은 어떤 과자를 좋아하나요?', createdAt: new Date() },
      { author: 8, status: 'teen', title: '좋아하는 음료는?', content: '저는 콜라를 좋아해요. 여러분은 어떤 음료를 좋아하나요?', createdAt: new Date() },
      { author: 9, status: 'teen', title: '좋아하는 책 장르는?', content: '저는 판타지 소설을 좋아해요. 여러분은 어떤 책 장르를 좋아하나요?', createdAt: new Date() },
      { author: 10, status: 'teen', title: '가장 좋아하는 명절은?', content: '저는 설날을 가장 좋아해요. 여러분은 어떤 명절을 좋아하나요?', createdAt: new Date() }
    ]);
    console.log('Mock post data inserted');

    // 댓글 데이터 삽입
    const comments = [
      { postID: 1, author: 2, status: 'teen', content: '저도 롤 좋아해요! 주로 어떤 챔피언 하세요?', createdAt: new Date() },
      { postID: 2, author: 3, status: 'teen', content: '저는 수학을 좋아해요. 문제를 풀 때 재미있어요.', createdAt: new Date() },
      { postID: 3, author: 1, status: 'teen', content: '캠핑 정말 재미있죠! 저는 친구들과 놀이공원에 갔던 기억이 좋아요.', createdAt: new Date() },
      { postID: 4, author: 4, status: 'teen', content: '인셉션은 정말 생각하게 만드는 영화에요.', createdAt: new Date() },
      { postID: 5, author: 5, status: 'teen', content: '저는 농구를 좋아해요!', createdAt: new Date() },
      { postID: 6, author: 6, status: 'teen', content: '저도 K-POP을 좋아해요! 어떤 그룹을 좋아하세요?', createdAt: new Date() },
      { postID: 7, author: 7, status: 'teen', content: '독서 정말 좋죠. 저는 주로 소설을 읽어요.', createdAt: new Date() },
      { postID: 8, author: 8, status: 'teen', content: '피자는 언제 먹어도 맛있어요!', createdAt: new Date() },
      { postID: 9, author: 9, status: 'teen', content: '제주도는 정말 아름다운 곳이에요.', createdAt: new Date() },
      { postID: 10, author: 10, status: 'teen', content: '의사는 정말 존경받는 직업이에요. 꼭 이루세요!', createdAt: new Date() },
      { postID: 11, author: 1, status: 'teen', content: '그림 그리기는 정말 재미있죠.', createdAt: new Date() },
      { postID: 12, author: 2, status: 'teen', content: '저도 봄을 좋아해요. 꽃이 피어서 예쁘죠.', createdAt: new Date() },
      { postID: 13, author: 3, status: 'teen', content: '파란색은 정말 예쁜 색이에요.', createdAt: new Date() },
      { postID: 14, author: 4, status: 'teen', content: '저도 강아지를 좋아해요. 귀엽죠.', createdAt: new Date() },
      { postID: 15, author: 5, status: 'teen', content: '딸기는 정말 맛있어요.', createdAt: new Date() },
      { postID: 16, author: 6, status: 'teen', content: '저는 축구를 좋아해요.', createdAt: new Date() },
      { postID: 17, author: 7, status: 'teen', content: '초콜릿은 정말 맛있어요.', createdAt: new Date() },
      { postID: 18, author: 8, status: 'teen', content: '콜라는 시원하고 맛있어요.', createdAt: new Date() },
      { postID: 19, author: 9, status: 'teen', content: '판타지 소설은 정말 재미있죠.', createdAt: new Date() },
      { postID: 20, author: 10, status: 'teen', content: '저도 설날을 좋아해요. 가족들과 함께 보내서 좋아요.', createdAt: new Date() }
    ];
    await Comment.bulkCreate(comments);
    console.log('Mock comment data inserted');

    // 질문글 데이터 삽입
    await Question.bulkCreate([
      { author: 1, title: '게임을 하면서 느끼는 즐거움은 무엇인가요?', status: 'teen', content: '여러분은 게임을 하면서 어떤 점이 가장 재미있나요?', createdAt: new Date() },
      { author: 2, title: '좋아하는 과목을 선택한 이유는?', status: 'teen', content: '여러분은 왜 그 과목을 좋아하게 되었나요?', createdAt: new Date() },
      { author: 3, title: '친구들과의 추억을 어떻게 쌓나요?', status: 'teen', content: '여러분은 친구들과 어떤 활동을 하면서 추억을 쌓나요?', createdAt: new Date() },
    ]);
    console.log('Mock question data inserted');

    // 답변 데이터 삽입
    await Answer.bulkCreate([
      { questionID: 1, author: 2, status: 'teen', content: '저는 친구들과 함께 게임할 때 가장 즐거워요.', createdAt: new Date() },
      { questionID: 2, author: 3, status: 'teen', content: '선생님이 재미있게 가르쳐주셔서 그 과목을 좋아하게 되었어요.', createdAt: new Date() },
      { questionID: 3, author: 1, status: 'teen', content: '같이 여행을 가거나 취미 활동을 하면서 추억을 쌓아요.', createdAt: new Date() },
    ]);
    console.log('Mock answer data inserted');

    // 오픈 채팅방 데이터 삽입
    await OpenChatRoom.bulkCreate([
      { name: '일반 채팅' },
      { name: '게임 토크' },
      { name: '음악 이야기' },
      { name: '영화 & TV' },
      { name: '잡담' }
    ]);
    console.log('Mock open chat rooms data inserted');

    // 날짜 범위 설정
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 5);
    const endDate = new Date();
    endDate.setDate(today.getDate() + 5);

    // 매일 질문 데이터 생성
    const everydayQuestions = [
      { question: '가장 좋아하는 책은 무엇인가요?', order: 1 },
      { question: '완벽한 하루를 묘사해주세요.', order: 2 },
      { question: '가장 큰 목표는 무엇인가요?', order: 3 },
      { question: '오늘 감사한 것은 무엇인가요?', order: 4 },
      { question: '열심히 일하게 만드는 동기는 무엇인가요?', order: 5 },
      { question: '가장 좋아하는 취미는 무엇인가요?', order: 6 },
      { question: '꿈의 직업은 무엇인가요?', order: 7 },
      { question: '이상적인 휴가를 묘사해주세요.', order: 8 },
      { question: '가장 좋아하는 영화는 무엇인가요?', order: 9 },
      { question: '가장 큰 성취는 무엇인가요?', order: 10 },
    ];

    // 매일 답변 데이터 생성
    const dailyQuestions = [
      { content: '저는 해리포터 시리즈를 정말 좋아해요.', userId: 1, userName: 'Alice3', questionIndex: 0 },
      { content: '가족과 함께하는 하루가 완벽한 하루라고 생각해요.', userId: 2, userName: 'Bob3', questionIndex: 1 },
      { content: '저는 과학자가 되어서 인류에게 도움이 되고 싶어요.', userId: 3, userName: 'Charlie3', questionIndex: 2 },
      { content: '오늘은 친구와 함께 시간을 보내서 감사해요.', userId: 4, userName: 'David', questionIndex: 3 },
      { content: '저는 성공을 위해 끊임없이 노력하는 것이 동기부여가 됩니다.', userId: 5, userName: 'Emma', questionIndex: 4 },
      { content: '저는 그림 그리기가 가장 좋아하는 취미입니다.', userId: 6, userName: 'Frank', questionIndex: 5 },
      { content: '저의 꿈의 직업은 게임 개발자입니다.', userId: 7, userName: 'Grace', questionIndex: 6 },
      { content: '이상적인 휴가는 산과 바다를 모두 즐길 수 있는 곳이에요.', userId: 8, userName: 'Hank', questionIndex: 7 },
      { content: '저는 인셉션이라는 영화를 가장 좋아해요.', userId: 9, userName: 'Ivy', questionIndex: 8 },
      { content: '가장 큰 성취는 대학 입학입니다.', userId: 10, userName: 'Jack', questionIndex: 9 },
      { content: '저는 해리포터 시리즈를 정말 좋아해요.', userId: 1, userName: 'Alice3', questionIndex: 0 },
      { content: '가족과 함께하는 하루가 완벽한 하루라고 생각해요.', userId: 2, userName: 'Bob3', questionIndex: 1 },
      { content: '저는 과학자가 되어서 인류에게 도움이 되고 싶어요.',      userId: 3, userName: 'Charlie3', questionIndex: 2 },
      { content: '오늘은 친구와 함께 시간을 보내서 감사해요.', userId: 4, userName: 'David', questionIndex: 3 },
      { content: '저는 성공을 위해 끊임없이 노력하는 것이 동기부여가 됩니다.', userId: 5, userName: 'Emma', questionIndex: 4 },
      { content: '저는 그림 그리기가 가장 좋아하는 취미입니다.', userId: 6, userName: 'Frank', questionIndex: 5 },
      { content: '저의 꿈의 직업은 게임 개발자입니다.', userId: 7, userName: 'Grace', questionIndex: 6 },
      { content: '이상적인 휴가는 산과 바다를 모두 즐길 수 있는 곳이에요.', userId: 8, userName: 'Hank', questionIndex: 7 },
      { content: '저는 인셉션이라는 영화를 가장 좋아해요.', userId: 9, userName: 'Ivy', questionIndex: 8 },
      { content: '가장 큰 성취는 대학 입학입니다.', userId: 10, userName: 'Jack', questionIndex: 9 }
    ];

    const questions = [];
    const answers = [];

    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(startDate.getDate() + i);

      questions.push({
        question: everydayQuestions[i].question,
        date: date,
        order: everydayQuestions[i].order,
      });

      answers.push({
        title: everydayQuestions[i].question,
        content: dailyQuestions[i].content,
        date: date,
        userId: dailyQuestions[i].userId,
        userName: dailyQuestions[i].userName,
        questionId: i + 1,
        isShared: Math.random() > 0.5, // 50% chance of being shared
      });
    }

    await EverydayQuestion.bulkCreate(questions);
    console.log('Mock everyday questions data inserted');

    await DailyQuestion.bulkCreate(answers);
    console.log('Mock daily questions data inserted');
  } catch (error) {
    console.error('Unable to insert mock data:', error);
  }
};

module.exports = insertMockData;

