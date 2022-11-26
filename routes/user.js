const { Router } = require('express');

const {
  signin,
  signup,
  resetPassword,
  changePassword,
} = require('../services/auth/controllers');
const { setupTokenInResponse } = require('../middleware');

const router = Router();

router.post('/signup', signup, setupTokenInResponse);

router.post('/login', signin, setupTokenInResponse);

router.post('/reset-password', resetPassword);

router.post('/change-password', changePassword, setupTokenInResponse);

module.exports = router;
