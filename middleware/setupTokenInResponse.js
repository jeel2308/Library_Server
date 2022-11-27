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
  findUserByRefreshToken,
  deleteRefreshToken,
  deleteAllRefreshTokensOfUser,
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

const setupTokenInResponseOfLogin = async (req, res, next) => {
  const user = req.user;

  const { REFRESH_TOKEN_EXPIRATION_DURATION } = process.env;

  const oldRefreshToken = _last(
    _split(_get(req.cookies, 'Refresh token'), ' ')
  );

  try {
    if (!_isEmpty(oldRefreshToken)) {
      const userId = await findUserByRefreshToken({
        refreshToken: oldRefreshToken,
      });

      /**
       * This condition will be false only when, refresh token is stolen
       */
      const isValidUser = userId === String(user._id);
      if (isValidUser) {
        await deleteRefreshToken({ refreshToken: oldRefreshToken });
      } else {
        await deleteAllRefreshTokensOfUser({ userId });
        next({ statusCode: 403, message: 'Unauthenticated' });
        return;
      }
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

const setupTokenInResponse = (req, res, next) => {
  const user = req.user;
  const { REFRESH_TOKEN_EXPIRATION_DURATION } = process.env;
  try {
    const { refreshToken, accessToken } = _generateAccessAndRefreshToken({
      user,
    });

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
  setupTokenInResponseOfLogin,
};
