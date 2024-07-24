const { Op } = require('sequelize');
const Question = require('../models/questionModel');
const jwt = require('jsonwebtoken');

// 모든 질문글 조회 + 페이징 기능 추가
const getAllQuestions = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const offset = (page - 1) * size;
  const limit = size;

  try {
    const {count, rows}= await Question.findAndCountAll({
      offset,
      limit
    });

    res.status(200).json({
      totalItems: count,
      totlaPages: Math.ceil(count / size),
      currentPage:page,
      questions:rows
    });

  } catch (error) {
    console.error('질문 조회 중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '질문 조회 중 오류가 발생했습니다' });
  }
};
//질문글 제목 조회
const getAllQuestionTitles = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const offset = (page - 1) * size;
  const limit = size;

  try {
    const { count, rows } = await Question.findAndCountAll({
      attributes: ['title'],
      offset,
      limit
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      questions: rows
    });
  } catch (error) {
    console.error('제목 조회 중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '제목 조회 중 오류가 발생했습니다' });
  }
};

//질문글 내용
const getAllQuestionContents = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const offset = (page - 1) * size;
  const limit = size;

  try {
    const { count, rows } = await Question.findAndCountAll({
      attributes: ['content'],
      offset,
      limit
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      questions: rows
    });
  } catch (error) {
    console.error('내용 조회 중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '내용 조회 중 오류가 발생했습니다' });
  }
};

// 특정 질문글 조회
const getQuestionById = async (req, res) => {
  const { questionID } = req.params;
  const userStatus = req.user.status;

  try {
    const question = await Question.findByPk(questionID);
    if (!question) {
      return res.status(404).json({ message: '질문을 찾을 수 없습니다.' });
    }
    res.status(200).json(question);
  } catch (error) {
    console.error('질문 조회 중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '질문글 조회 중 오류가 발생했습니다' });
  }
};

// 질문글 작성
const createQuestion = async (req, res) => {
  //const { author, title, content } = req.body;
  const author = req.user.id;
  const status = req.user.status;
  const { title, content } = req.body;

  if (!author || !title || !content) {
    return res.status(400).json({ message: '제목 및 내용은 필수입니다.' });
  }

  try {
    const newQuestion = await Question.create({
      author,
      status,
      title,
      content,
      createdAt: new Date()
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('질문글 작성 중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '질문글 작성 중 오류가 발생했습니다' });
  }
};

// 게시글 수정
const updateQuestion = async (req, res) => {
  const { questionID } = req.params;
  //const { author, title, content } = req.body;
  const updateId = req.user.id;
  const {title, content }=req.body;

  if (!title || !content) {
    return res.status(400).json({ message: '제목 및 내용은 필수입니다.' });
  }

  try {
    const question = await Question.findByPk(questionID);
    if (!question) {
      return res.status(404).json({ message: '질문글을 찾을 수 없습니다.' });
    }

    if(question.author !== updateId) {
        return res.status(403).json({ message: '수정 권한이 없습니다.', questionAuthor: question.author, updateId});
    }

    question.title = title;
    question.content = content;
    await question.save();

    res.status(200).json(question);
  } catch (error) {
    console.error('질문글 수정 중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '질문글 수정 중 오류가 발생했습니다' });
  }
};

// 게시글 삭제
const deleteQuestion = async (req, res) => {
  const { questionID } = req.params;
  const authorId = req.user.id;

  try {
    const question = await Question.findByPk(questionID);
    if (!question) {
      return res.status(404).json({ message: '질문글을 찾을 수 없습니다.' });
    }
    if(question.author !== authorId){
        return res.status(403).json({message:'삭제 권한이 없습니다.'});
    }

    await question.destroy();
    res.status(200).json({ message: '질문글이 삭제되었습니다.' });
  } catch (error) {
    console.error('질문글 삭제 중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '질문글 삭제 중 오류가 발생했습니다' });
  }
};

module.exports = {
  getAllQuestions,
  getAllQuestionTitles,
  getAllQuestionContents,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion
};