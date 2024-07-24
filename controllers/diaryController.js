const Diary = require('../models/Diary');

// 일기 생성
const createDiary = async (req, res) => {
  const { title, content, date } = req.body;
  const userId = req.user.id;
  const userName = req.user.name; // user 모델에 name 필드 사용

  try {
    const newDiary = await Diary.create({ title, content, date, userId, userName });
    res.status(201).json(newDiary);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

// 일기 수정
const updateDiary = async (req, res) => {
  const { id } = req.params;
  const { title, content, date } = req.body;
  const userId = req.user.id;

  try {
    const diary = await Diary.findOne({ where: { id, userId } });

    if (!diary) {
      return res.status(404).send('Diary not found or not authorized');
    }

    diary.title = title;
    diary.content = content;
    diary.date = date;

    await diary.save();
    res.status(200).json(diary);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

// 일기 삭제
const deleteDiary = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const diary = await Diary.findOne({ where: { id, userId } });

    if (!diary) {
      return res.status(404).send('Diary not found or not authorized');
    }

    await diary.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

// 일기 조회
const checkDiary = async (req, res) => {
  const { id } = req.params;

  try {
    const diary = await Diary.findByPk(id);

    if (!diary) {
      return res.status(404).send('Diary not found');
    }

    res.status(200).json(diary);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

// 로그인한 사용자의 모든 일기 조회
const allDiaries = async (req, res) => {
  const userId = req.user.id;

  try {
    const diaries = await Diary.findAll({ where: { userId } });
    res.status(200).json(diaries);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
};

module.exports = {
  createDiary,
  updateDiary,
  deleteDiary,
  checkDiary,
  allDiaries
};
