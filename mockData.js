const bcrypt = require('bcrypt');
const User = require('./models/User');
const Post = require('./models/postModel');
const Comment = require('./models/commentModel');
const OpenChatRoom = require('./models/chat/OpenChatRoom');
const EverydayQuestion = require('./models/daily_question/EverydayQuestion');
const DailyQuestion = require('./models/daily_question/DailyQuestion');
const Meet = require('./models/meet/MeetModel');
const MeetVote = require('./models/meet/MeetVoteModel'); 
const Diary = require('./models/diary')

// 랜덤 점수를 생성하는 함수
const generateRandomScore = (prevScore) => {
  const min = Math.max(0, prevScore - 10); // 이전 점수의 범위에 기반한 최소값
  const max = Math.min(100, prevScore + 10); // 이전 점수의 범위에 기반한 최대값
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

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
      { name: 'Jack', phone: '010-0000-0000', email: 'jack@gmail.com', password: await bcrypt.hash('password10', 10), status: "teen", birthdate: new Date('2005-01-01') },
      { name: 'User1', phone: '010-1234-5678', email: 'asdf@gmail.com', password: await bcrypt.hash('asdf', 10), status: "teen", birthdate: new Date('2006-01-01') },
      { name: 'User2', phone: '010-8765-4321', email: 'asdfasdf@gmail.com', password: await bcrypt.hash('asdfasdf', 10), status: "teen", birthdate: new Date('2007-01-01') }
    ]);
    
    console.log('User mock data inserted');

    // 게시물 데이터 삽입
    const postsFree = [
      { author: 1, category: 'free', status: 'new-mom', title: '출산 후 회복에 좋은 음식 추천', content: '출산 후 회복에 도움이 되는 음식을 추천해주세요. 저는 영양가 있는 스프가 좋았어요.', createdAt: new Date() },
      { author: 2, category: 'free', status: 'new-mom', title: '산후 조리원 선택 팁', content: '산후 조리원을 선택할 때 고려해야 할 사항이 무엇인지 공유해요. 비용, 시설, 서비스 등.', createdAt: new Date() },
      { author: 3, category: 'free', status: 'new-mom', title: '출산 후 스트레칭과 운동', content: '출산 후 스트레칭과 운동을 어떻게 시작했는지 이야기해요. 가벼운 운동이 회복에 도움을 줄 수 있어요.', createdAt: new Date() },
      { author: 4, category: 'free', status: 'new-mom', title: '아기와의 첫 외출 팁', content: '아기와 처음 외출할 때 유용한 팁을 공유해요. 무엇을 챙겨야 하는지, 어떻게 준비해야 하는지.', createdAt: new Date() },
      { author: 5, category: 'free', status: 'new-mom', title: '출산 후 수유의 어려움', content: '출산 후 수유하면서 겪는 어려움에 대해 이야기해요. 유용한 수유 팁이나 도움이 되는 제품.', createdAt: new Date() },
      { author: 6, category: 'free', status: 'new-mom', title: '산후 우울증 극복 방법', content: '산후 우울증을 겪으신 분들의 조언과 극복 방법을 공유해요. 도움을 받을 수 있는 지원 방법도 좋습니다.', createdAt: new Date() },
      { author: 7, category: 'free', status: 'new-mom', title: '아기 돌보기 꿀팁', content: '아기 돌보는 데 도움이 되는 꿀팁을 공유해요. 잠 잘 자는 법, 수면 패턴 등.', createdAt: new Date() },
      { author: 8, category: 'free', status: 'new-mom', title: '출산 준비물 체크리스트', content: '출산 전 준비해야 할 물품의 체크리스트를 공유해요. 무엇을 준비했는지, 무엇이 도움이 되었는지.', createdAt: new Date() },
      { author: 9, category: 'free', status: 'new-mom', title: '엄마를 위한 자가 관리 팁', content: '출산 후 엄마 스스로 관리할 수 있는 방법을 이야기해요. 간단한 자가 관리 팁이나 운동법.', createdAt: new Date() },
      { author: 10, category: 'free', status: 'new-mom', title: '출산 후 가족과의 소통', content: '출산 후 가족과의 소통이 중요해요. 가족의 도움을 요청하거나 소통하는 방법에 대해 이야기해요.', createdAt: new Date() }
    ];
    const postsInfoTips = [
      { author: 1, category: 'info-tips', status: 'new-mom', title: '출산 준비 필수 체크리스트', content: '출산 전에 준비해야 할 필수 체크리스트를 공유해요. 병원 준비물, 출산 가방 등.', createdAt: new Date() },
      { author: 2, category: 'info-tips', status: 'new-mom', title: '산후 조리법 및 팁', content: '산후 회복을 위해 알아두면 좋은 조리법과 팁을 공유해요. 건강한 식사와 수면 관리 방법.', createdAt: new Date() },
      { author: 3, category: 'info-tips', status: 'new-mom', title: '신생아 케어 기본 가이드', content: '신생아를 돌보는 기본적인 방법과 주의사항을 설명해요. 아기 목욕시키기, 기저귀 교환 등.', createdAt: new Date() },
      { author: 4, category: 'info-tips', status: 'new-mom', title: '산후 운동의 중요성', content: '출산 후 운동의 중요성과 안전하게 운동하는 방법을 소개해요. 가벼운 스트레칭부터 시작하세요.', createdAt: new Date() },
      { author: 5, category: 'info-tips', status: 'new-mom', title: '모유 수유의 장점', content: '모유 수유의 여러 장점과 유용한 팁을 공유해요. 모유 수유를 성공적으로 하는 방법에 대해 이야기해요.', createdAt: new Date() },
      { author: 6, category: 'info-tips', status: 'new-mom', title: '출산 후 우울증 증상과 대처법', content: '산후 우울증의 증상과 대처법에 대해 알아보세요. 도움을 받을 수 있는 기관과 전문가의 조언.', createdAt: new Date() },
      { author: 7, category: 'info-tips', status: 'new-mom', title: '아기 돌보는 데 필요한 기본 용품', content: '아기 돌보기에 필요한 기본 용품과 선택 요령을 소개해요. 유용한 용품 리스트와 팁.', createdAt: new Date() },
      { author: 8, category: 'info-tips', status: 'new-mom', title: '출산 후 피부 관리 방법', content: '출산 후 피부 관리를 위한 팁과 유용한 제품을 소개해요. 피부 회복을 도와주는 팁과 자주 묻는 질문.', createdAt: new Date() },
      { author: 9, category: 'info-tips', status: 'new-mom', title: '부모 역할에 대한 준비', content: '부모 역할에 대한 준비와 마음가짐을 공유해요. 출산 후 부모로서의 역할과 책임.', createdAt: new Date() },
      { author: 10, category: 'info-tips', status: 'new-mom', title: '아기와의 첫 달: 주의사항', content: '아기와 함께하는 첫 달 동안 주의해야 할 사항과 조언을 공유해요. 기본적인 아기 돌보기 팁.', createdAt: new Date() }
    ];
    const postsShopping = [
      { author: 1, category: 'shopping', status: 'new-mom', title: '아기용품 구매 가이드', content: '아기용품을 구매할 때 유용한 가이드를 공유해요. 필요한 용품과 추천 제품.', createdAt: new Date() },
      { author: 2, category: 'shopping', status: 'new-mom', title: '산후 회복을 위한 필수 제품', content: '산후 회복에 도움이 되는 제품들을 소개해요. 편안한 의류, 수유 제품 등.', createdAt: new Date() },
      { author: 3, category: 'shopping', status: 'new-mom', title: '아기 침대와 유모차 추천', content: '아기 침대와 유모차를 선택할 때 참고할만한 추천 제품과 팁을 공유해요.', createdAt: new Date() },
      { author: 4, category: 'shopping', status: 'new-mom', title: '출산 준비물 쇼핑 리스트', content: '출산 전 준비물 쇼핑 리스트를 작성해보세요. 필수 품목과 추천 제품을 알려드립니다.', createdAt: new Date() },
      { author: 5, category: 'shopping', status: 'new-mom', title: '유아용 의류 쇼핑 팁', content: '유아용 의류를 구매할 때 유용한 팁과 추천 브랜드를 공유해요. 품질과 편안함이 중요해요.', createdAt: new Date() },
      { author: 6, category: 'shopping', status: 'new-mom', title: '출산 후 필수 건강 제품', content: '출산 후 엄마와 아기에게 필요한 건강 제품을 소개해요. 편리하게 사용할 수 있는 제품 리스트.', createdAt: new Date() },
      { author: 7, category: 'shopping', status: 'new-mom', title: '산후 패드 및 수유 브라', content: '산후 패드와 수유 브라의 선택 팁과 추천 제품을 공유해요. 편안함과 기능성을 고려해요.', createdAt: new Date() },
      { author: 8, category: 'shopping', status: 'new-mom', title: '아기 장난감 구매 팁', content: '아기 장난감을 구매할 때 고려해야 할 사항과 추천 장난감을 소개해요.', createdAt: new Date() },
      { author: 9, category: 'shopping', status: 'new-mom', title: '산후 조리원용 필수 제품', content: '산후 조리원에서 유용하게 사용할 수 있는 제품들을 소개해요. 실용적이고 편리한 제품들.', createdAt: new Date() },
      { author: 10, category: 'shopping', status: 'new-mom', title: '아기용 식기 및 수유 용품', content: '아기용 식기와 수유 용품을 선택할 때의 팁과 추천 제품을 공유해요. 안전하고 유용한 제품.', createdAt: new Date() }
    ];

    
    await Post.bulkCreate(postsFree);
    await Post.bulkCreate(postsInfoTips);
    await Post.bulkCreate(postsShopping);
    console.log('Mock post data inserted');

    // 댓글 데이터 삽입
    const commentsFree = [
      { postID: 1, author: 2, status: 'new-mom', content: '출산 후 회복을 위해 어떤 음식을 드셨나요? 저는 육아로 바빠서 잘 챙기기 어려워요.', createdAt: new Date() },
      { postID: 2, author: 3, status: 'new-mom', content: '산후 조리원 선택에 어려움을 겪었어요. 어떤 기준으로 선택하셨는지 궁금해요.', createdAt: new Date() },
      { postID: 3, author: 4, status: 'new-mom', content: '출산 후 스트레칭은 언제부터 시작하는 게 좋을까요? 몸이 힘들어서 걱정이에요.', createdAt: new Date() },
      { postID: 4, author: 5, status: 'new-mom', content: '아기와의 첫 외출, 긴장되네요. 어떤 것들을 준비해야 할까요?', createdAt: new Date() },
      { postID: 5, author: 6, status: 'new-mom', content: '수유가 힘들어지면 어떻게 해결하셨나요? 조언이 필요해요.', createdAt: new Date() },
      { postID: 6, author: 7, status: 'new-mom', content: '산후 우울증 조짐이 보이는데, 어떻게 극복했는지 궁금해요.', createdAt: new Date() },
      { postID: 7, author: 8, status: 'new-mom', content: '아기 돌보는 데 도움이 되는 꿀팁이 있을까요? 저도 막 시작했는데 힘드네요.', createdAt: new Date() },
      { postID: 8, author: 9, status: 'new-mom', content: '출산 준비물에서 꼭 필요한 것들이 뭐였나요? 추천해주시면 감사해요.', createdAt: new Date() },
      { postID: 9, author: 10, status: 'new-mom', content: '엄마 스스로의 자가 관리, 어떻게 하고 계신가요? 지친 날이 많아서요.', createdAt: new Date() },
      { postID: 10, author: 1, status: 'new-mom', content: '가족과의 소통 방법이 궁금해요. 어떻게 도움을 요청하고 계신가요?', createdAt: new Date() }
    ];
    const commentsInfoTips = [
      { postID: 1, author: 2, status: 'new-mom', content: '출산 준비 체크리스트에 도움이 많이 되네요. 추가로 필요한 물품이 있을까요?', createdAt: new Date() },
      { postID: 2, author: 3, status: 'new-mom', content: '산후 조리법이 너무 유용해요. 추천해주신 식단을 어떻게 조리하면 좋을지 더 알고 싶어요.', createdAt: new Date() },
      { postID: 3, author: 4, status: 'new-mom', content: '신생아 케어에 대해 더 알고 싶어요. 기본적인 주의사항이나 팁이 있을까요?', createdAt: new Date() },
      { postID: 4, author: 5, status: 'new-mom', content: '산후 운동을 언제부터 시작했는지, 어떤 운동이 좋았는지 궁금해요.', createdAt: new Date() },
      { postID: 5, author: 6, status: 'new-mom', content: '모유 수유의 장점에 대해 더 자세히 알고 싶어요. 성공적인 수유 방법을 공유해 주세요.', createdAt: new Date() },
      { postID: 6, author: 7, status: 'new-mom', content: '산후 우울증 증상과 대처법에 대해 도움이 많이 되었어요. 전문가 상담은 어떻게 받으셨나요?', createdAt: new Date() },
      { postID: 7, author: 8, status: 'new-mom', content: '아기 돌보기에 필요한 기본 용품 리스트가 유용하네요. 추천 제품이나 브랜드가 있을까요?', createdAt: new Date() },
      { postID: 8, author: 9, status: 'new-mom', content: '출산 후 피부 관리, 특히 얼굴 피부에 어떤 제품을 사용하셨는지 궁금해요.', createdAt: new Date() },
      { postID: 9, author: 10, status: 'new-mom', content: '부모 역할 준비가 쉽지 않네요. 어떻게 마음가짐을 유지하셨는지 조언해 주세요.', createdAt: new Date() },
      { postID: 10, author: 1, status: 'new-mom', content: '아기와의 첫 달 동안 주의사항을 잘 정리해 주셨네요. 실제로 경험해보니 어떤 점이 가장 중요했나요?', createdAt: new Date() }
    ];
    const commentsShopping = [
      { postID: 1, author: 2, status: 'new-mom', content: '아기용품 구매할 때 가장 유용했던 제품이 무엇인지 알려주세요. 비교해보고 싶어요.', createdAt: new Date() },
      { postID: 2, author: 3, status: 'new-mom', content: '산후 회복 제품, 어떤 것이 가장 효과적이었는지 추천해 주세요. 피로회복에 도움이 되기를 바라요.', createdAt: new Date() },
      { postID: 3, author: 4, status: 'new-mom', content: '아기 침대와 유모차 선택 시 고려해야 할 점이 무엇인지 알려주시면 감사하겠습니다.', createdAt: new Date() },
      { postID: 4, author: 5, status: 'new-mom', content: '출산 준비물 리스트에서 가장 유용했던 아이템은 무엇인지 공유해 주세요.', createdAt: new Date() },
      { postID: 5, author: 6, status: 'new-mom', content: '유아용 의류, 어떤 브랜드가 좋았는지 추천해 주세요. 편안함과 내구성이 중요해요.', createdAt: new Date() },
      { postID: 6, author: 7, status: 'new-mom', content: '출산 후 필수 건강 제품 리스트, 효과를 본 제품이 있다면 추천해 주세요.', createdAt: new Date() },
      { postID: 7, author: 8, status: 'new-mom', content: '산후 패드와 수유 브라, 어떤 제품이 가장 편리했는지 공유해 주세요. 많은 도움이 될 것 같아요.', createdAt: new Date() },
      { postID: 8, author: 9, status: 'new-mom', content: '아기 장난감 구매 시 어떤 점을 고려해야 하는지 조언 부탁드립니다. 안전이 가장 중요해요.', createdAt: new Date() },
      { postID: 9, author: 10, status: 'new-mom', content: '산후 조리원에서 유용했던 제품이 무엇인지 추천해 주세요. 실용적인 제품이 필요해요.', createdAt: new Date() },
      { postID: 10, author: 1, status: 'new-mom', content: '아기용 식기와 수유 용품, 어떤 제품이 특히 좋았는지 공유해 주세요. 실용성을 고려해요.', createdAt: new Date() }
    ];
    await Comment.bulkCreate(commentsFree);
    await Comment.bulkCreate(commentsInfoTips);
    await Comment.bulkCreate(commentsShopping);        
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
      { question: '가장 좋아하는 영화를 감상해보세요. 편안한 자리에서 기분전환을 해보세요.', order: 1 },
      { question: '가벼운 스트레칭을 10분 동안 해보세요. 몸과 마음이 편안해질 것입니다.', order: 2 },
      { question: '오늘 마시고 싶은 차나 음료를 만들어보세요. 새로운 레시피를 시도해보는 것도 좋습니다.', order: 3 },
      { question: '오늘 산책을 해보세요. 걷기 좋은 경로를 찾아보세요.', order: 4 },
      { question: '짧은 명상 시간을 가져보세요. 마음을 차분하게 하고 스트레스를 줄일 수 있습니다.', order: 5 },
      { question: '오늘은 새로운 요리를 시도해보세요. 가족과 함께하는 식사 시간을 즐겨보세요.', order: 6 },
      { question: '자연을 느낄 수 있는 곳에서 시간을 보내보세요. 공원에서 시간을 보내거나 정원을 가꾸어보세요.', order: 7 },
      { question: '가벼운 요가 세션을 해보세요. 신체적 긴장을 풀어주고 정신적으로도 도움이 됩니다.', order: 8 },
      { question: '편안한 음악을 들으며 휴식을 취해보세요. 좋아하는 음악이 있다면 그 음악을 즐겨보세요.', order: 9 },
      { question: '오늘의 기분을 일기로 적어보세요. 자신의 감정을 글로 표현해보세요.', order: 10 },
    ];

    // 매일 답변 데이터 생성
    const dailyQuestions = [
      { content: '오늘 인셉션이라는 영화를 감상했습니다. 오랜만에 영화를 보며 기분전환을 할 수 있어서 좋았어요.', userId: 1, userName: 'Alice3', questionIndex: 0 },
      { content: '10분 동안 가벼운 스트레칭을 했더니 몸이 한결 가벼워졌어요. 기분도 한층 좋아졌습니다.', userId: 2, userName: 'Bob3', questionIndex: 1 },
      { content: '오늘 허브티를 만들어 마셨습니다. 향긋한 허브 향이 마음을 차분하게 해줬어요.', userId: 3, userName: 'Charlie3', questionIndex: 2 },
      { content: '날씨가 좋아서 공원에서 산책을 했습니다. 걷다 보니 기분이 한결 상쾌해졌습니다.', userId: 4, userName: 'David', questionIndex: 3 },
      { content: '명상 시간을 가져보니 마음이 차분해지고 스트레스가 줄어드는 느낌이 들었습니다.', userId: 5, userName: 'Emma', questionIndex: 4 },
      { content: '오늘은 새로운 요리를 시도했어요. 가족들이 맛있게 먹어줘서 기분이 좋았습니다.', userId: 6, userName: 'Frank', questionIndex: 5 },
      { content: '자연 속에서 시간을 보내니 마음이 편안해지고, 기분이 좋아졌습니다.', userId: 7, userName: 'Grace', questionIndex: 6 },
      { content: '요가를 하면서 신체적 긴장이 풀리는 걸 느꼈습니다. 몸과 마음이 편안해졌어요.', userId: 8, userName: 'Hank', questionIndex: 7 },
      { content: '오늘은 편안한 음악을 들으며 휴식을 취했습니다. 음악이 주는 평온함이 마음에 안정감을 주었습니다.', userId: 9, userName: 'Ivy', questionIndex: 8 },
      { content: '오늘의 감정을 일기로 적어보니 마음이 한결 가벼워졌습니다. 감정을 글로 표현하니 정리가 잘 되는 것 같아요.', userId: 10, userName: 'Jack', questionIndex: 9 },
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

    // Meet 데이터 삽입
    const meets = await Meet.bulkCreate([
      { author: 1, title: '주말 산책 모임', content: '이번 주말에 공원에서 산책을 하려고 합니다. 함께 하실 분?', expirationTime: new Date(new Date().getTime() + 5 * 60 * 60 * 1000), maxCapacity: 10 },
      { author: 2, title: '요가 클래스', content: '가벼운 요가 클래스를 열어보려 합니다. 참여하실 분들 모집합니다.', expirationTime: new Date(new Date().getTime() + 5 * 60 * 60 * 1000), maxCapacity: 15 },
      { author: 3, title: '영화 감상 모임', content: '다 같이 모여서 영화를 보고 이야기를 나눠보는 시간을 가져요.', expirationTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), maxCapacity: 20 },
      { author: 4, title: '등산 모임', content: '다음 주말에 등산을 계획하고 있습니다. 참여하실 분들은 연락주세요.', expirationTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), maxCapacity: 8 },
      { author: 5, title: '요리 클래스', content: '이번 주말에 요리 클래스를 열려고 합니다. 다 같이 요리하고 즐기는 시간 가지려 해요.', expirationTime: new Date(new Date().getTime() + 5 * 60 * 60 * 1000), maxCapacity: 12 },
      { author: 6, title: '독서 모임', content: '매주 한 권의 책을 읽고 의견을 나누는 독서 모임입니다.', expirationTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), maxCapacity: 10 },
      { author: 7, title: '자전거 타기', content: '도심 속에서 자전거를 타며 건강을 챙기고자 합니다. 함께 하실 분들 모여요.', expirationTime: new Date(new Date().getTime() + 5 * 60 * 60 * 1000), maxCapacity: 10 },
      { author: 8, title: '미술 전시회 관람', content: '이번 주말에 미술 전시회를 보러 가려고 합니다. 함께 하실 분들 모여요.', expirationTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), maxCapacity: 6 },
      { author: 9, title: '봉사활동 모임', content: '주말에 함께 봉사활동에 참여할 분들을 찾습니다.', expirationTime: new Date(new Date().getTime() + 5 * 60 * 60 * 1000), maxCapacity: 20 },
      { author: 10, title: '저녁 식사 모임', content: '바쁜 일상 속에서 함께 모여 저녁 식사를 하는 모임입니다.', expirationTime: new Date(new Date().getTime() + 5 * 60 * 60 * 1000), maxCapacity: 10 }
    ]);
    
    console.log('Meet mock data inserted');

    // MeetVote 데이터 삽입
    const meetVotes = [
      { meetID: meets[0].meetID, voterID: 2 },
      { meetID: meets[1].meetID, voterID: 3 },
      { meetID: meets[2].meetID, voterID: 4 },
      { meetID: meets[3].meetID, voterID: 5 },
      { meetID: meets[4].meetID, voterID: 6 },
      { meetID: meets[5].meetID, voterID: 7 },
      { meetID: meets[6].meetID, voterID: 8 },
      { meetID: meets[7].meetID, voterID: 9 },
      { meetID: meets[8].meetID, voterID: 10 },
      { meetID: meets[9].meetID, voterID: 1 },
    ];
    await MeetVote.bulkCreate(meetVotes);
    console.log('MeetVote mock data inserted');


    const diaryToday = new Date(); // 오늘 날짜
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(diaryToday.getMonth() - 1);

    // 초기 점수
    let previousScore = 50;

    // 목업 데이터 생성
    const diaries = [
      { title: '출산 후 첫날의 감정', content: '출산 후 첫날, 감정이 매우 복잡합니다. 기쁨과 걱정이 동시에 느껴집니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth() - 1, 1), score: previousScore, author: 11 },
      { title: '아이와의 첫 상봉', content: '아기와 처음 만났을 때의 감동과 함께 새로운 삶에 대한 불안이 느껴집니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth() - 1, 3), score: previousScore = generateRandomScore(previousScore), author: 11 },
      { title: '수면 부족과 피로', content: '아기를 돌보는 것에 지치고, 수면 부족으로 피로감이 계속됩니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth() - 1, 6), score: previousScore = generateRandomScore(previousScore), author: 11 },
      { title: '부모님과의 대화', content: '부모님과의 대화에서 도움을 받았지만, 여전히 마음의 불안이 가시지 않습니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth() - 1, 9), score: previousScore = generateRandomScore(previousScore), author: 11 },
      { title: '출산 후의 변화', content: '몸과 마음이 모두 변화하는 과정에서 힘들지만, 아기를 위해 노력합니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth() - 1, 12), score: previousScore = generateRandomScore(previousScore), author: 11 },
      { title: '아이의 첫 미소', content: '아기의 첫 미소를 보면서 마음이 조금은 편안해집니다. 그래도 여전히 많은 걱정이 있습니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth() - 1, 15), score: previousScore = generateRandomScore(previousScore), author: 11 },
      { title: '산후 회복', content: '산후 회복이 생각보다 힘들고, 몸과 마음 모두 지치고 있습니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth() - 1, 18), score: previousScore = generateRandomScore(previousScore), author: 11 },
      { title: '아기의 수면 패턴', content: '아기의 수면 패턴이 불규칙하여 힘들지만, 조금씩 나아지는 것 같습니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth() - 1, 21), score: previousScore = generateRandomScore(previousScore), author: 11 },
      { title: '도움이 필요한 순간', content: '혼자서 모든 것을 감당하기 어려워 도움을 요청하고 싶습니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth() - 1, 24), score: previousScore = generateRandomScore(previousScore), author: 11 },
      { title: '미래에 대한 걱정', content: '아기의 미래에 대한 걱정이 계속되지만, 하루하루를 열심히 살아가고 있습니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth() - 1, 27), score: previousScore = generateRandomScore(previousScore), author: 11 },
      { title: '작은 기쁨', content: '아기가 웃는 모습을 보면서 작은 기쁨을 느끼지만, 여전히 어려운 점이 많습니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth() - 1, 30), score: previousScore = generateRandomScore(previousScore), author: 11 },
      { title: '하루 일과', content: '하루 일과를 정리하며, 아기와의 시간은 소중하지만 힘든 부분도 많습니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth(), 2), score: previousScore = generateRandomScore(previousScore), author: 11 },
      { title: '가족과의 시간', content: '가족과 함께 시간을 보내는 것이 위안이 되지만, 여전히 많은 고민이 있습니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth(), 5), score: previousScore = generateRandomScore(previousScore), author: 11 },
      { title: '자기 자신 돌보기', content: '자신을 돌볼 시간이 부족하여 피로가 누적되고 있습니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth(), 8), score: previousScore = generateRandomScore(previousScore), author: 11 },
      { title: '아기와의 소통', content: '아기와의 소통이 중요하다는 것을 깨닫고, 더욱 노력하고 있습니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth(), 11), score: previousScore = generateRandomScore(previousScore), author: 11 },
      { title: '지원이 필요한 시점', content: '다시 한 번 주변의 지원이 필요함을 느끼며, 도움을 요청하고 싶습니다.', createdAt: new Date(diaryToday.getFullYear(), diaryToday.getMonth(), 14), score: previousScore = generateRandomScore(previousScore), author: 11 }
    ];

    // 다이어리 데이터를 데이터베이스에 삽입합니다.
    await Diary.bulkCreate(diaries);
    console.log('Mock diaries created successfully.');

  } catch (error) {
    console.error('Unable to insert mock data:', error);
  }
};

module.exports = insertMockData;