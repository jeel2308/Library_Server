/**--external-- */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _isEmpty = require('lodash/isEmpty');
const _get = require('lodash/get');
const { OAuth2Client } = require('google-auth-library');

/**--relative-- */
const { generatePassword } = require('../../utils');
const {
  addUser,
  findOneAndUpdateUser,
  findMultipleUsers,
  addRefreshToken,
  deleteRefreshTokens,
  findRefreshToken,
} = require('./queries');
const { sendMailV2 } = require('../emailGenerator');

const googleAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const oldUser = await findUserByEmail({ email });
    if (oldUser) {
      return next({ statusCode: 500, message: 'User already exists!!' });
    }

    const user = await addUser({
      name,
      email,
      password: bcrypt.hashSync(password, 8),
    });
    req.user = user;
    next();
  } catch (e) {
    return next({ statusCode: 500, message: e.message });
  }
};

const localSignIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail({ email });

    if (!user) {
      return next({ statusCode: 404, message: 'User does not exist' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
      return next({ statusCode: 500, message: 'Incorrect password' });
    }

    if (user.showResetPasswordFlow) {
      await findOneAndUpdateUser(
        { _id: user._id },
        {
          hasLoggedInWithTemporaryPassword: true,
        }
      );
      res.status(200).send({
        id: user._id,
        showResetPasswordFlow: user.showResetPasswordFlow,
      });

      return;
    }

    req.user = user;
    next();
  } catch (e) {
    return next({ statusCode: 500, message: e.message });
  }
};

const googleSignIn = async (req, res, next) => {
  const { idToken } = req.body;
  const { GOOGLE_AUTH_CLIENT_ID } = process.env;

  try {
    const loginTicket = await googleAuthClient.verifyIdToken({
      idToken,
      audience: GOOGLE_AUTH_CLIENT_ID,
    });
    const { name, email } = loginTicket.getPayload();
    let user = await findUserByEmail({ email });
    if (_isEmpty(user)) {
      user = addUser({ name, email });
    }

    req.user = user;
    next();
  } catch (e) {
    return next({ statusCode: 500, message: e.message });
  }
};

//No need to verify token for SPA
const microsoftSignIn = async (req, res, next) => {
  const { idToken } = req.body;

  try {
    const { preferred_username: email, name } = jwt.decode(idToken);

    let user = await findUserByEmail({ email });
    if (_isEmpty(user)) {
      user = addUser({ name, email });
    }

    req.user = user;
    next();
  } catch (e) {
    return next({ statusCode: 500, message: e.message });
  }
};

const signin = async (req, res, next) => {
  const { method } = req.body;

  switch (method) {
    case 'local': {
      await localSignIn(req, res, next);
      break;
    }
    case 'google': {
      await googleSignIn(req, res, next);
      break;
    }
    case 'microsoft': {
      await microsoftSignIn(req, res, next);
      break;
    }
  }
};

const resetPassword = async (req, res, next) => {
  const { email } = req.body;

  let user = null;

  try {
    user = await findUserByEmail({ email });
    if (_isEmpty(user)) {
      return next({ statusCode: 404, message: 'User does not exist!' });
    }

    const newPassword = generatePassword({ length: 10 });

    await findOneAndUpdateUser(
      { email },
      {
        password: bcrypt.hashSync(newPassword, 8),
        showResetPasswordFlow: true,
      },
      { new: true }
    );

    await sendMailV2({
      to: email,
      subject: 'Reset password',
      body: `<p>We have received request for resetting your password.</p>
        <p>Your temporary password is <b>${newPassword}</b></p>
        <p>Sign in with this password and set your new password</p> 
        `,
    });

    res.status(200).send({ message: 'email sent' });
  } catch (e) {
    return next({ statusCode: 500, message: e.message });
  }
};

const changePassword = async (req, res, next) => {
  const { id: userId, password } = req.body;

  try {
    const user = await findUserById({ id: userId });

    if (_isEmpty(user)) {
      return next({ statusCode: 404, message: 'User does not exist!' });
    }

    if (user.showResetPasswordFlow && user.hasLoggedInWithTemporaryPassword) {
      const encryptedPassword = bcrypt.hashSync(password, 8);
      const updatedUser = await findOneAndUpdateUser(
        { _id: userId },
        {
          password: encryptedPassword,
          showResetPasswordFlow: false,
          hasLoggedInWithTemporaryPassword: false,
        },
        { new: true }
      );

      req.user = updatedUser;
      next();
    } else {
      next({ statusCode: 403, message: 'Unauthenticated request' });
    }
  } catch (e) {
    return next({ statusCode: 500, message: e.message });
  }
};

const findMultipleUsersById = async ({ ids }) => {
  return await findMultipleUsers({ _id: { $in: ids } });
};

const findUserById = async ({ id }) => {
  const [user] = await findMultipleUsers({ _id: id });
  return user;
};

const findUserByEmail = async ({ email }) => {
  const [user] = await findMultipleUsers({ email });
  return user;
};

const updateUserById = async ({ id, ...otherUpdates }) => {
  return await findOneAndUpdateUser({ _id: id }, otherUpdates, { new: true });
};

const addRefreshTokenForUser = async ({ refreshToken, userId }) => {
  return await addRefreshToken({ refreshToken, userId });
};

const deleteRefreshToken = async ({ refreshToken }) => {
  return await deleteRefreshTokens({ refreshToken });
};

const deleteAllRefreshTokensOfUser = async ({ userId }) => {
  return await deleteRefreshTokens({ userId });
};

const findUserByRefreshToken = async ({ refreshToken }) => {
  const response = await findRefreshToken({ refreshToken });
  return _get(response, '[0].userId');
};

module.exports = {
  signin,
  signup,
  resetPassword,
  changePassword,
  findMultipleUsersById,
  findUserById,
  findUserByEmail,
  updateUserById,
  addRefreshTokenForUser,
  deleteRefreshToken,
  deleteAllRefreshTokensOfUser,
  findUserByRefreshToken,
};
