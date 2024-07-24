const { Op } = require('sequelize');
const Post = require('../models/postModel');
const jwt = require('jsonwebtoken');

// 모든 게시글 조회 + 페이징 기능 추가
const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const offset = (page - 1) * size;
  const limit = size;

  try {
    const {count, rows}= await Post.findAndCountAll({
      offset,
      limit
    });

    res.status(200).json({
      totalItems: count,
      totlaPages: Math.ceil(count / size),
      currentPage:page,
      posts:rows
    });
    //const posts = await Post.findAll();
    //res.status(200).json(posts);
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
  //const { author, title, content } = req.body;
  const author = req.user.id;
  //기능 test를 위한 작성자 추가
  if (!author) {
    author = 9999999;
  }
  //윗부분 지울것
  const status = req.user.status;
  const { title, content } = req.body;

  if (!author || !title || !content) {
    return res.status(400).json({ message: '제목 및 내용은 필수입니다.' });
  }

  try {
    const newPost = await Post.create({
      author,
      status,
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
  //const { author, title, content } = req.body;
  const updateId = req.user.id;
  const {title, content }=req.body;

  if (!title || !content) {
    return res.status(400).json({ message: '제목 및 내용은 필수입니다.' });
  }

  try {
    const post = await Post.findByPk(postID);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }

    if(post.author !== updateId) {
        return res.status(403).json({ message: '수정 권한이 없습니다.', postAuthor: post.author, updateId});
    }

    //post.author = author;
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
  const authorId = req.user.id;

  try {
    const post = await Post.findByPk(postID);
    if (!post) {
      return res.status(404).json({ message: '게시글을 찾을 수 없습니다.' });
    }
    if(post.author !== authorId){
        return res.status(403).json({message:'삭제 권한이 없습니다.'});
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
