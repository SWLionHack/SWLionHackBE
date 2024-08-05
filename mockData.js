const bcrypt = require('bcrypt');
const User = require('./models/User');
const Post = require('./models/postModel');
const Comment = require('./models/commentModel');
const OpenChatRoom = require('./models/chat/OpenChatRoom');
const EverydayQuestion = require('./models/daily_question/EverydayQuestion');
const DailyQuestion = require('./models/daily_question/DailyQuestion');
const QnA = require('./models/meet/MeetModel');
const QnAVote = require('./models/meet/MeetVoteModel'); 

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

    // 게시물 데이터 삽입
    const posts = await Post.bulkCreate([
      { author: 1, category:'info-tips', status: 'teen', title: '가장 좋아하는 게임은 무엇인가요?', content: '저는 롤을 정말 좋아해요. 여러분은 어떤 게임을 좋아하나요?', createdAt: new Date() },
      { author: 2, category:'info-tips', status: 'teen', title: '학교에서 가장 좋아하는 과목은?', content: '저는 과학을 좋아해요. 여러분은 어떤 과목을 좋아하나요?', createdAt: new Date() },
      { author: 3, category:'share-feelings',status: 'teen', title: '친구들과의 추억을 공유해봐요', content: '여러분은 친구들과 어떤 추억이 있나요? 저는 캠핑 갔던 기억이 가장 좋아요.', createdAt: new Date() },
      { author: 4, category:'share-feelings',status: 'teen', title: '가장 좋아하는 영화는 무엇인가요?', content: '저는 인셉션이라는 영화를 가장 좋아해요. 여러분은 어떤 영화를 좋아하나요?', createdAt: new Date() },
      { author: 5, category:'share-feelings', status: 'teen', title: '어떤 운동을 좋아하시나요?', content: '저는 축구를 좋아해요. 여러분은 어떤 운동을 좋아하나요?', createdAt: new Date() },
      { author: 6, category:'share-feelings',status: 'teen', title: '가장 좋아하는 음악 장르는?', content: '저는 K-POP을 좋아해요. 여러분은 어떤 음악을 좋아하나요?', createdAt: new Date() },
      { author: 7, category:'share-feelings',status: 'teen', title: '휴일에는 무엇을 하나요?', content: '저는 주로 독서를 해요. 여러분은 휴일에 무엇을 하나요?', createdAt: new Date() },
      { author: 8, category:'share-feelings',status: 'teen', title: '가장 좋아하는 음식은?', content: '저는 피자를 좋아해요. 여러분은 어떤 음식을 좋아하나요?', createdAt: new Date() },
      { author: 9, category:'info-tips', status: 'teen', title: '가장 기억에 남는 여행지는?', content: '저는 제주도가 가장 기억에 남아요. 여러분은 어떤 여행지가 기억에 남나요?', createdAt: new Date() },
      { author: 10, category:'share-feelings',status: 'teen', title: '미래의 꿈은 무엇인가요?', content: '저는 의사가 되고 싶어요. 여러분의 미래의 꿈은 무엇인가요?', createdAt: new Date() },
      { author: 1, category:'share-feelings',status: 'teen', title: '좋아하는 취미는 무엇인가요?', content: '저는 그림 그리기가 취미에요. 여러분의 취미는 무엇인가요?', createdAt: new Date() },
      { author: 2, category:'info-tips', status: 'teen', title: '가장 좋아하는 계절은?', content: '저는 봄이 가장 좋아요. 여러분은 어떤 계절을 좋아하나요?', createdAt: new Date() },
      { author: 3, category:'share-feelings',status: 'teen', title: '가장 좋아하는 색깔은?', content: '저는 파란색을 좋아해요. 여러분은 어떤 색깔을 좋아하나요?', createdAt: new Date() },
      { author: 4, category:'info-tips', status: 'teen', title: '좋아하는 동물은?', content: '저는 강아지를 좋아해요. 여러분은 어떤 동물을 좋아하나요?', createdAt: new Date() },
      { author: 5, category:'share-feelings',status: 'teen', title: '좋아하는 과일은?', content: '저는 딸기를 좋아해요. 여러분은 어떤 과일을 좋아하나요?', createdAt: new Date() },
      { author: 6, category:'share-feelings',status: 'teen', title: '좋아하는 스포츠는?', content: '저는 야구를 좋아해요. 여러분은 어떤 스포츠를 좋아하나요?', createdAt: new Date() },
      { author: 7, category:'info-tips', status: 'teen', title: '좋아하는 과자는?', content: '저는 초콜릿을 좋아해요. 여러분은 어떤 과자를 좋아하나요?', createdAt: new Date() },
      { author: 8, category:'share-feelings',status: 'teen', title: '좋아하는 음료는?', content: '저는 콜라를 좋아해요. 여러분은 어떤 음료를 좋아하나요?', createdAt: new Date() },
      { author: 9, category:'share-feelings',status: 'teen', title: '좋아하는 책 장르는?', content: '저는 판타지 소설을 좋아해요. 여러분은 어떤 책 장르를 좋아하나요?', createdAt: new Date() },
      { author: 10, category:'share-feelings',status: 'teen', title: '가장 좋아하는 명절은?', content: '저는 설날을 가장 좋아해요. 여러분은 어떤 명절을 좋아하나요?', createdAt: new Date() }
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
      { content: '저는 과학자가 되어서 인류에게 도움이 되고 싶어요.', userId: 3, userName: 'Charlie3', questionIndex: 2 },
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
      const date = new Date(today); // today 기준으로 날짜 설정
      date.setDate(today.getDate() + i); // 각 질문의 날짜를 설정

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
        isShared: Math.random() > 0.5, // 50% 확률로 공유됨
      });
    }


    await EverydayQuestion.bulkCreate(questions);
    console.log('Mock everyday questions data inserted');

    await DailyQuestion.bulkCreate(answers);
    console.log('Mock daily questions data inserted');

    // QnA 데이터 삽입
    const qnaData = [
      { author: 1, title: '온라인 수업이 더 효율적입니다.', content: '온라인 수업은 시간과 장소에 구애받지 않고 효율적으로 학습할 수 있는 장점이 있습니다.', expirationTime: new Date(new Date().getTime() + 1 * 60 * 60 * 1000), createdAt: new Date() },
      { author: 2, title: '매일 체육 수업이 필요합니다.', content: '매일 체육 수업은 학생들의 건강을 증진시키고 스트레스를 해소하는 데 도움이 됩니다.', expirationTime: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), createdAt: new Date() },
      { author: 3, title: '스마트폰 사용 시간을 제한해야 합니다.', content: '스마트폰 사용 시간 제한은 학생들의 집중력을 높이고 건강한 생활 습관을 유지하는 데 중요합니다.', expirationTime: new Date(new Date().getTime() + 3 * 60 * 60 * 1000), createdAt: new Date() },
      { author: 4, title: '청소년들에게 더 많은 자율성을 줘야 합니다.', content: '청소년들이 자율성을 가질 때 자기 주도적인 학습과 성장이 가능합니다.', expirationTime: new Date(new Date().getTime() + 4 * 60 * 60 * 1000), createdAt: new Date() },
      { author: 5, title: '학교 급식의 질을 개선해야 합니다.', content: '학교 급식의 질 개선은 학생들의 건강과 학습 효율을 높이는 데 중요합니다.', expirationTime: new Date(new Date().getTime() + 5 * 60 * 60 * 1000), createdAt: new Date() },
      { author: 6, title: '학교에서 코딩 교육이 필수적입니다.', content: '코딩 교육은 미래 사회에서 중요한 역량을 키우는 데 필수적입니다.', expirationTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), createdAt: new Date() },
      { author: 7, title: '학교 시험은 오픈북으로 해야 합니다.', content: '오픈북 시험은 학생들이 단순 암기보다 문제 해결 능력을 기르는 데 도움이 됩니다.', expirationTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), createdAt: new Date() },
      { author: 8, title: '학생들이 학교 규칙을 직접 정해야 합니다.', content: '학생들이 직접 규칙을 정하면 책임감을 느끼고 더 잘 지킬 수 있습니다.', expirationTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), createdAt: new Date() },
      { author: 9, title: '학교에서는 교복 대신 사복을 입어야 합니다.', content: '사복 착용은 학생들의 개성을 존중하고 편안한 학습 환경을 제공합니다.', expirationTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), createdAt: new Date() },
      { author: 10, title: '학교에서 스마트폰 사용을 금지해야 합니다.', content: '스마트폰 사용 금지는 학생들이 수업에 더 집중할 수 있도록 돕습니다.', expirationTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), createdAt: new Date() }
    ];   

    // QnA 데이터를 데이터베이스에 삽입
    const qnaRecords = await QnA.bulkCreate(qnaData);

    // QnA 데이터 삽입 후 생성된 ID 가져오기
    const qnaIDs = qnaRecords.map(record => record.qnaID);

    // QnAVote 데이터 생성
    const qnaVotesData = [
      { qnaID: qnaIDs[0], voterID: 2 },
      { qnaID: qnaIDs[1], voterID: 3 },
      { qnaID: qnaIDs[1], voterID: 4 },
      { qnaID: qnaIDs[2], voterID: 4 },
      { qnaID: qnaIDs[2], voterID: 5 },
      { qnaID: qnaIDs[2], voterID: 6 },
      { qnaID: qnaIDs[3], voterID: 5 },
      { qnaID: qnaIDs[3], voterID: 6 },
      { qnaID: qnaIDs[3], voterID: 7 },
      { qnaID: qnaIDs[3], voterID: 8 },
      { qnaID: qnaIDs[4], voterID: 6 },
      { qnaID: qnaIDs[4], voterID: 7 },
      { qnaID: qnaIDs[4], voterID: 8 },
      { qnaID: qnaIDs[4], voterID: 9 },
      { qnaID: qnaIDs[4], voterID: 10 },
      { qnaID: qnaIDs[5], voterID: 7 },
      { qnaID: qnaIDs[5], voterID: 8 },
      { qnaID: qnaIDs[5], voterID: 9 },
      { qnaID: qnaIDs[5], voterID: 10 },
      { qnaID: qnaIDs[5], voterID: 1 },
      { qnaID: qnaIDs[6], voterID: 8 },
      { qnaID: qnaIDs[6], voterID: 9 },
      { qnaID: qnaIDs[6], voterID: 10 },
      { qnaID: qnaIDs[6], voterID: 1 },
      { qnaID: qnaIDs[6], voterID: 2 },
      { qnaID: qnaIDs[6], voterID: 3 },
      { qnaID: qnaIDs[7], voterID: 9 },
      { qnaID: qnaIDs[7], voterID: 10 },
      { qnaID: qnaIDs[7], voterID: 1 },
      { qnaID: qnaIDs[7], voterID: 2 },
      { qnaID: qnaIDs[7], voterID: 3 },
      { qnaID: qnaIDs[7], voterID: 4 },
      { qnaID: qnaIDs[8], voterID: 10 },
      { qnaID: qnaIDs[8], voterID: 1 },
      { qnaID: qnaIDs[8], voterID: 2 },
      { qnaID: qnaIDs[8], voterID: 3 },
      { qnaID: qnaIDs[8], voterID: 4 },
      { qnaID: qnaIDs[8], voterID: 5 },
      { qnaID: qnaIDs[8], voterID: 6 },
      { qnaID: qnaIDs[9], voterID: 1 },
      { qnaID: qnaIDs[9], voterID: 2 },
      { qnaID: qnaIDs[9], voterID: 3 },
      { qnaID: qnaIDs[9], voterID: 4 },
      { qnaID: qnaIDs[9], voterID: 5 },
      { qnaID: qnaIDs[9], voterID: 6 },
      { qnaID: qnaIDs[9], voterID: 7 },
      { qnaID: qnaIDs[9], voterID: 8 },
      { qnaID: qnaIDs[9], voterID: 9 }
    ];

    // QnAVote 데이터 삽입
    await QnAVote.bulkCreate(qnaVotesData);
    console.log('Mock QnA and QnAVote data inserted');


  } catch (error) {
    console.error('Unable to insert mock data:', error);
  }
};

module.exports = insertMockData;