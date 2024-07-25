const Expert = require('../models/Expert');

// 전문가 목록을 가져오는 함수
const getExperts = async (req, res) => {
  try {
    const experts = await Expert.findAll();
    res.status(200).json(experts);
  } catch (error) {
    console.error('Error fetching experts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = getExperts;
