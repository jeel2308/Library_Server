/**--external-- */
const jwt = require('jsonwebtoken');
const _get = require('lodash/get');
const _split = require('lodash/split');
const _last = require('lodash/last');
const _isEmpty = require('lodash/isEmpty');

/**--relative-- */
const { convertTimeStringInSeconds } = require('../utils');
const {
  addRefreshTokenForUser,
  deleteRefreshToken,
} = require('../services/auth/controllers');

const _generateAccessAndRefreshToken = ({ user }) => {
  const {
    JWT_SECRET,
    ACCESS_TOKEN_EXPIRATION_DURATION,
    REFRESH_TOKEN_JWT_SECRET,
    REFRESH_TOKEN_EXPIRATION_DURATION,
  } = process.env;
  const accessToken = _generateToken({
    user,
    secret: JWT_SECRET,
    expiresIn: ACCESS_TOKEN_EXPIRATION_DURATION,
  });

  const refreshToken = _generateToken({
    user,
    secret: REFRESH_TOKEN_JWT_SECRET,
    expiresIn: REFRESH_TOKEN_EXPIRATION_DURATION,
  });
  return { accessToken, refreshToken };
};

const _generateToken = ({ user, secret, expiresIn }) => {
  return jwt.sign({ id: user._id }, secret, {
    expiresIn,
  });
};

const setupTokenInResponseOfSignup = async (req, res, next) => {
  const user = req.user;
  const { REFRESH_TOKEN_EXPIRATION_DURATION } = process.env;
  try {
    const { refreshToken, accessToken } = _generateAccessAndRefreshToken({
      user,
    });
    await addRefreshTokenForUser({ refreshToken, userId: user._id });

    const timeInSeconds = convertTimeStringInSeconds({
      time: REFRESH_TOKEN_EXPIRATION_DURATION,
    });

    res.cookie('Refresh token', 'Bearer ' + refreshToken, {
      maxAge: timeInSeconds * 1000,
      httpOnly: true,
    });
    res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      token: accessToken,
    });
  } catch (e) {
    next({ statusCode: 500, message: e.message });
  }
};

const setupTokenInResponse = async (req, res, next) => {
  const user = req.user;

  const { REFRESH_TOKEN_EXPIRATION_DURATION } = process.env;
  try {
    const oldRefreshToken = _last(
      _split(_get(req.cookies, 'Refresh token'), ' ')
    );

    if (!_isEmpty(oldRefreshToken)) {
      await deleteRefreshToken({ refreshToken: oldRefreshToken });
    }

    const { refreshToken, accessToken } = _generateAccessAndRefreshToken({
      user,
    });
    await addRefreshTokenForUser({ refreshToken, userId: user._id });

    const timeInSeconds = convertTimeStringInSeconds({
      time: REFRESH_TOKEN_EXPIRATION_DURATION,
    });

    res.cookie('Refresh token', 'Bearer ' + refreshToken, {
      maxAge: timeInSeconds * 1000,
      httpOnly: true,
    });
    res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      token: accessToken,
    });
  } catch (e) {
    next({ statusCode: 500, message: e.message });
  }
};

module.exports = {
  setupTokenInResponse,
  setupTokenInResponseOfSignup,
};
