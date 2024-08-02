const Post = require('../../models/postModel');
const Comment = require('../../models/commentModel');
const DailyQuestion = require('../../models/daily_question/DailyQuestion');
const QnA = require('../../models/qna/QnAModel');
const Question = require('../../models/questionModel');

exports.getUserPosts = async (userId) => {
  return await Post.findAll({ where: { author: userId } });
};

exports.getUserComments = async (userId) => {
  return await Comment.findAll({ where: { author: userId } });
};

exports.getUserDailyQuestions = async (userId) => {
  return await DailyQuestion.findAll({ where: { userId } });
};

exports.getUserQnAs = async (userId) => {
  return await QnA.findAll({ where: { author: userId } });
};

exports.getUserQuestions = async (userId) => {
  return await Question.findAll({ where: { author: userId } });
};
