/**--external-- */
const { Router } = require('express');
const _get = require('lodash/get');

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
  verifyToken,
} = require('../middleware');

const router = Router();

router.post('/signup', signup, setupTokenInResponseOfSignup);

router.post('/login', signin, setupTokenInResponse);

router.post('/reset-password', resetPassword);

router.post('/change-password', changePassword, setupTokenInResponse);

router.post('/refresh-old-token', refreshOldToken, setupTokenInResponse);

router.get('/logout', verifyToken, async (req, res) => {
  const oldRefreshToken = _get(req.cookies, 'Refresh token');
  await deleteRefreshToken({
    refreshToken: oldRefreshToken,
    userId: req.user._id,
  });
  res.clearCookie('Refresh token', { httpOnly: true, secure: true });
  res.status(200).send({ message: 'Successfully logged out' });
});

module.exports = router;
