const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const User = require("../models/User");
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

// 특정 게시글에 달린 모든 댓글 조회
const getCommentsByPostId = async (req, res) => {
    const { postID } = req.params;
  
    try {
      const comments = await Comment.findAll({
        where: { postID },
        include: [{
          model: User,
          attributes: ['id', 'status']
        }]
      });
      res.status(200).json(comments);
    } catch (error) {
      console.error('댓글 조회 중 오류가 발생했습니다:', error);
      res.status(500).json({ message: '댓글 조회 중 오류가 발생했습니다' });
    }
  };
  
  // 댓글 작성
  const createComment = async (req, res) => {
    const { postID } = req.params;
    const author = req.user.id;
    const { content } = req.body;
  
    if (!content) {
      return res.status(400).json({ message: '댓글 내용은 필수입니다.' });
    }
  
    try {
      const post = await Post.findByPk(postID);
      if (!post) {
        return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
      }
  
      const user = await User.findByPk(author);
      if (!user) {
        return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
      }
  
      const newComment = await Comment.create({
        postID,
        author,
        status: user.status,
        content,
        createdAt: new Date()
      });
      res.status(201).json(newComment);
    } catch (error) {
      console.error('댓글 작성 중 오류가 발생했습니다:', error);
      res.status(500).json({ message: '댓글 작성 중 오류가 발생했습니다' });
    }
  };
  
  // 댓글 삭제
  const deleteComment = async (req, res) => {
    const { commentID } = req.params;
    const authorId = req.user.id;
  
    try {
      const comment = await Comment.findByPk(commentID);
      if (!comment) {
        return res.status(404).json({ message: '댓글을 찾을 수 없습니다.' });
      }
  
      if (comment.author !== authorId) {
        return res.status(403).json({ message: '삭제 권한이 없습니다.' });
      }
  
      await comment.destroy();
      res.status(200).json({ message: '댓글이 삭제되었습니다.' });
    } catch (error) {
      console.error('댓글 삭제 중 오류가 발생했습니다:', error);
      res.status(500).json({ message: '댓글 삭제 중 오류가 발생했습니다' });
    }
  };
  
  module.exports = {
    getCommentsByPostId,
    createComment,
    deleteComment
  };