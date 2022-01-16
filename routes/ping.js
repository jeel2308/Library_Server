const express = require('express');

const router = new express.Router();

router.get('/ping', (_, res) => {
  res.status(200).send('Server is running');
});

module.exports = router;
