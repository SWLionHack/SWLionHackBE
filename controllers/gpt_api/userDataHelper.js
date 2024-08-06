const Post = require('../../models/postModel');
const Comment = require('../../models/commentModel');
const DailyQuestion = require('../../models/daily_question/DailyQuestion');
const QnA = require('../../models/meet/MeetModel');
const Question = require('../../models/questionModel');
const Survey = require('../../models/survey');
const Diary = require('../../models/diary')

exports.getUserPosts = async (userId) => {
  const posts = await Post.findAll({
    where: {
      author: userId
    }
  });
  return posts;
};

exports.getUserComments = async (userId) => {
  const comments = await Comment.findAll({ where: { author: userId } });
  return comments;
};

exports.getUserDailyQuestions = async (userId) => {
  const dailyQuestions = await DailyQuestion.findAll({ where: { userId } });
  return dailyQuestions;
};

exports.getUserQnAs = async (userId) => {
  const qnas = await QnA.findAll({ where: { author: userId } });
  return qnas;
};

exports.getUserQuestions = async (userId) => {
  const questions = await Question.findAll({ where: { author: userId } });
  return questions;
};

exports.getUserSurvey = async (userId) => {
  const surveys = await Survey.findAll({ where: { userId } });
  return surveys;
};

exports.getUserDiary = async (userId) => {
  const surveys = await Diary.findAll({ where: { author: userId } });
  return surveys;
};
