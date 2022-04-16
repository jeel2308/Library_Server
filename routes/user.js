const { Router } = require('express');

const { signin, signup, resetPassword } = require('../controllers');

const router = Router();

router.post('/signup', signup);

router.post('/login', signin);

router.post('/reset-password', resetPassword);

module.exports = router;
