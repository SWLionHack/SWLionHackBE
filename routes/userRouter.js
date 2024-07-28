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
const { authenticateJWT, checkNotAuthenticated } = require('../middleware/authMiddleware');

const userRouter = express.Router();

// User routes
userRouter.get('/login', checkNotAuthenticated, loginPage);
userRouter.get('/sign-up', signUpPage);
userRouter.post('/login', login);
userRouter.post('/sign-up', signUp);
userRouter.post('/logout', logout);
userRouter.get('/protected', authenticateJWT, protectedRoute);
userRouter.get('/info', authenticateJWT, userInfo);

module.exports = userRouter;
