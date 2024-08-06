const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Expert = require('../models/expertChat/expertModel');

const getAllExperts = async (req, res) => {
  try {
      const experts = await Expert.findAll();
      res.status(200).json(experts);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch experts' });
  }
};

const getExpertById = async (req, res) => {
  try {
    const expertId = req.params.id;
    const expert = await Expert.findByPk(expertId);
    if (expert) {
      res.status(200).json(expert);
    } else {
      res.status(404).json({ error: 'Expert not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expert' });
  }
};

module.exports = { getAllExperts, getExpertById };


// const Expert = require('../models/Expert');

// // 전문가 목록을 가져오는 함수
// const getExperts = async (req, res) => {
//   try {
//     const experts = await Expert.findAll();
//     res.status(200).json(experts);
//   } catch (error) {
//     console.error('Error fetching experts:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// module.exports = getExperts;
