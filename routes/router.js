const express = require('express');
const {
  loginPage,
  signUpPage,
  login,
  signUp,
  protectedRoute,
  userInfo,
  logout
} = require('../controllers/userController');
const {
  createDiary,
  updateDiary,
  deleteDiary,
  checkDiary,
  allDiaries
} = require('../controllers/diaryController');
const { authenticateJWT, checkNotAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

// User routes
router.get('/login', checkNotAuthenticated, loginPage);
router.get('/sign-up', signUpPage);
router.post('/login', login);
router.post('/sign-up', signUp);
router.post('/logout', logout);
router.get('/protected', authenticateJWT, protectedRoute);
router.get('/info', authenticateJWT, userInfo);

// Diary routes
router.post('/diaries', authenticateJWT, createDiary);
router.put('/diaries/:id', authenticateJWT, updateDiary);
router.delete('/diaries/:id', authenticateJWT, deleteDiary);
router.get('/diaries/:id', authenticateJWT, checkDiary);
router.get('/diaries', authenticateJWT, allDiaries);

module.exports = router;
