const { Router } = require('express');

const {
  signin,
  signup,
  resetPassword,
  changePassword,
} = require('../services/auth/controllers');
const {
  setupTokenInResponse,
  setupTokenInResponseOfSignup,
  setupTokenInResponseOfLogin,
} = require('../middleware');

const router = Router();

router.post('/signup', signup, setupTokenInResponseOfSignup);

router.post('/login', signin, setupTokenInResponseOfLogin);

router.post('/reset-password', resetPassword);

router.post('/change-password', changePassword, setupTokenInResponse);

module.exports = router;
