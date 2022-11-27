const { Router } = require('express');

const {
  signin,
  signup,
  resetPassword,
  changePassword,
  refreshOldToken,
} = require('../services/auth/controllers');
const {
  setupTokenInResponse,
  setupTokenInResponseOfSignup,
} = require('../middleware');

const router = Router();

router.post('/signup', signup, setupTokenInResponseOfSignup);

router.post('/login', signin, setupTokenInResponse);

router.post('/reset-password', resetPassword);

router.post('/change-password', changePassword, setupTokenInResponse);

router.post('/refresh-old-token', refreshOldToken, setupTokenInResponse);

module.exports = router;
