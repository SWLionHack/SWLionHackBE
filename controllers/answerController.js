const Answer = require('../models/answerModel');
const Question = require('../models/questionModel');
const User = require("../models/User");
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

// 특정 게시글에 달린 모든 댓글 조회
const getAnswersByQuestionId = async (req, res) => {
    const { questionID } = req.params;
  
    try {
      const answers = await Answer.findAll({
        where: { questionID }
      });
      res.status(200).json(answers);
    } catch (error) {
      console.error('댓글 조회 중 오류가 발생했습니다:', error);
      res.status(500).json({ message: '댓글 조회 중 오류가 발생했습니다' });
    }
  };
  
  // 댓글 작성
  const createAnswer = async (req, res) => {
    const { questionID } = req.params;
    const author = req.user.id;
    const { content } = req.body;
  
    if (!content) {
      return res.status(400).json({ message: '댓글 내용은 필수입니다.' });
    }
  
    try {
      const question = await Question.findByPk(questionID);
      if (!question) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }
  
      const user = await User.findByPk(author);
      if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }
      
      //질문 작성자 정보 조회
      const questionAuthor = await User.findByPk(question.author);
      if(!questionAuthor) {
        return res.status(404).json({ message : '질문 작성자를 찾을 수 없습니다.'});
      }

      // 답변 작성 가능 여부 확인
      if (question.author !== author && user.age <= questionAuthor.age) {
        return res.status(403).json({ message: '답변 작성 권한이 없습니다.' });
      }
  
      const newAnswer = await Answer.create({
        questionID,
        author,
        status: user.status,
        content,
        createdAt: new Date()
      });
      res.status(201).json(newAnswer);
    } catch (error) {
      console.error('댓글 작성 중 오류가 발생했습니다:', error);
      res.status(500).json({ message: '댓글 작성 중 오류가 발생했습니다' });
    }
  };
  
  // 댓글 삭제
  const deleteAnswer = async (req, res) => {
    const { answerID } = req.params;
    const authorId = req.user.id;
  
    try {
      const answer = await Answer.findByPk(answerID);
      if (!answer) {
        return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
      }
  
      if (answer.author !== authorId) {
        return res.status(403).json({ message: '삭제 권한이 없습니다.' });
      }
  
      await answer.destroy();
      res.status(200).json({ message: '댓글이 삭제되었습니다.' });
    } catch (error) {
      console.error('댓글 삭제 중 오류가 발생했습니다:', error);
      res.status(500).json({ message: '댓글 삭제 중 오류가 발생했습니다' });
    }
  };
  
  module.exports = {
    getAnswersByQuestionId,
    createAnswer,
    deleteAnswer
  };