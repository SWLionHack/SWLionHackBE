const express = require('express');
const router = express.Router();
const { authenticateJWT } = require('../middleware/authMiddleware');
const expertController = require('../controllers/expertController'); // 경로 확인

router.get('/experts/profile', expertController.getAllExperts);
router.get('/experts/profile/:id', expertController.getExpertById);

module.exports = router;