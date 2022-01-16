const { Router } = require('express');

const { signin, signup } = require('../controllers');

const router = Router();

router.post('/signup', signup);

router.post('/login', signin);

module.exports = router;
