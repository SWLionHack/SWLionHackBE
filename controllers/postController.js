const { Op } = require('sequelize');
const Post = require('../models/postModel');
const jwt = require('jsonwebtoken');

const getAllPostTitles = async (req, res) => {
  const loginId = req.user.id;

  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  const status = req.user.status; // Assume this contains either '부모' or '자녀'
  const offset = (page - 1) * size;
  const limit = size;

  try {
    const { count, rows } = await Post.findAndCountAll({
      attributes: ['postID', 'title', 'author'],
      where: { status }, // Filter by status
      offset,
      limit,
      order: [['createdAt', 'DESC']], // 나중에 생성된 투표가 먼저 출력되도록 설정
    });

    const posts = rows.map(post => ({
      ...post.toJSON(),
      isAuthor: post.author === loginId // 로그인한 사용자가 작성자인지 확인
    }));

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      posts
    });
  } catch (error) {
    console.error('제목 조회 중 오류가 발생했습니다:', error);
    res.status(500).json({ message: '제목 조회 중 오류가 발생했습니다' });
  }
};

// 특정 게시글 조회
const getPostById = async (req, res) => {
  
  console.log('getPostById called'); // 함수 호출 여부 확인
  const { postID } = req.params;
  console.log('Post ID:', postID); // 요청된 postID 확인

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
  getAllPostTitles,
  getPostById,
  createPost,
  deletePost
};
