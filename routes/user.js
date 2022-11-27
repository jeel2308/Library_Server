/**--external-- */
const { Router } = require('express');
const _get = require('lodash/get');
const _split = require('lodash/split');
const _last = require('lodash/last');

const {
  signin,
  signup,
  resetPassword,
  changePassword,
  refreshOldToken,
  deleteRefreshToken,
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

router.get('/logout', async (req, res) => {
  const oldRefreshToken = _last(
    _split(_get(req.cookies, 'Refresh token'), ' ')
  );
  await deleteRefreshToken({ refreshToken: oldRefreshToken });
  res.clearCookie('Refresh token', { httpOnly: true, secure: true });
  res.status(200).send({ message: 'Successfully logged out' });
});

module.exports = router;
