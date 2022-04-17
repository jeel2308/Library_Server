const { Router } = require('express');

const {
  signin,
  signup,
  resetPassword,
  changePassword,
} = require('../controllers');

const router = Router();

router.post('/signup', signup);

router.post('/login', signin);

router.post('/reset-password', resetPassword);

router.post('/change-password', changePassword);

module.exports = router;
