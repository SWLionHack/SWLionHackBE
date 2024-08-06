const Diary = require('../models/diary');
const { Op } = require('sequelize'); // Sequelize의 연산자 불러오기

// 유저가 작성한 모든 일기 조회
exports.getAllDiaries = async (req, res) => {
    const author = req.user.id; // 현재 로그인한 유저의 ID
    try {
      const diaries = await Diary.findAll({
        where: { author },
        order: [['createdAt', 'DESC']], // 나중에 생성된 게시글이 먼저 출력되도록 설정
      });
      res.json(diaries);
    } catch (error) {
      console.error('Error while fetching diaries:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// 일기 작성
exports.createDiary = async (req, res) => {
    const author = req.user.id;
    const { title, content, date, score } = req.body;
  
    try {
      const diary = await Diary.create({
        title,
        content,
        author,
        createdAt: date || new Date(),
        score
      });
      
  
      res.status(201).json(diary);
    } catch (error) {
      console.error('Error while creating diary:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  };

// 특정 일기 조회
exports.getDiaryById = async (req, res) => {
  const diaryId = req.params.id;
  try {
      const diary = await Diary.findByPk(diaryId);
      if (!diary) {
          return res.status(404).json({ message: 'Diary not found' });
      }
      console.log('Diary found:', diary); // 로그 추가
      res.json(diary);
  } catch (error) {
      console.error('Error fetching diary:', error); // 에러 로그 추가
      res.status(500).json({ message: error.message });
  }
};
