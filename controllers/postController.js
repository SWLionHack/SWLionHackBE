const { Op } = require('sequelize');
const Post = require('../models/postModel');
const jwt = require('jsonwebtoken');

// 모든 게시글 조회
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.status(200).json(posts);
  } catch (error) {
    console.error('게시글 조회 중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '게시글 조회 중 오류가 발생했습니다' });
  }
};

// 특정 게시글 조회
const getPostById = async (req, res) => {
  const { postID } = req.params;

  try {
    const post = await Post.findByPk(postID);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('게시글 조회 중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '게시글 조회 중 오류가 발생했습니다' });
  }
};

// 게시글 작성
const createPost = async (req, res) => {
  const { author, title, content } = req.body;

  if (!author || !title || !content) {
    return res.status(400).json({ message: '작성자, 제목 및 내용은 필수입니다.' });
  }

  try {
    const newPost = await Post.create({
      author,
      title,
      content,
      createdAt: new Date()
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('게시글 작성 중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '게시글 작성 중 오류가 발생했습니다' });
  }
};

// 게시글 수정
const updatePost = async (req, res) => {
  const { postID } = req.params;
  const { author, title, content } = req.body;

  if (!author || !title || !content) {
    return res.status(400).json({ message: '작성자, 제목 및 내용은 필수입니다.' });
  }

  try {
    const post = await Post.findByPk(postID);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    post.author = author;
    post.title = title;
    post.content = content;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error('게시글 수정 중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '게시글 수정 중 오류가 발생했습니다' });
  }
};

// 게시글 삭제
const deletePost = async (req, res) => {
  const { postID } = req.params;

  try {
    const post = await Post.findByPk(postID);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    await post.destroy();
    res.status(200).json({ message: '게시글이 삭제되었습니다.' });
  } catch (error) {
    console.error('게시글 삭제 중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '게시글 삭제 중 오류가 발생했습니다' });
  }
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost
};
