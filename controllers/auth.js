/**--external-- */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _isEmpty = require('lodash/isEmpty');
const { OAuth2Client } = require('google-auth-library');

/**--relative-- */
const { generateJwt, generatePassword } = require('../utils');
const { findUser, addUser, findOneAndUpdateUser } = require('../services/user');
const { sendMailV2 } = require('../services/emailGenerator');

const googleAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const oldUser = await findUser({ email });
    if (oldUser) {
      return next({ statusCode: 500, message: 'User already exists!!' });
    }

    const user = await addUser({
      name,
      email,
      password: bcrypt.hashSync(password, 8),
    });

    const jwt = generateJwt({ user });

    res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      token: jwt,
    });
  } catch (e) {
    return next({ statusCode: 500, message: e.message });
  }
};

const localSignIn = async (req, res, next) => {
  const { email, password } = req.body;

  let user = undefined;

  try {
    user = await findUser({ email });
  } catch (e) {
    return next({ statusCode: 500, message: e.message });
  }

  if (!user) {
    return next({ statusCode: 404, message: 'User does not exist' });
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);

  if (!isValidPassword) {
    return next({ statusCode: 500, message: 'Incorrect password' });
  }

  if (user.showResetPasswordFlow) {
    res.status(200).send({
      id: user._id,
      showResetPasswordFlow: user.showResetPasswordFlow,
    });

    return;
  }

  /**
   * Token expiration is removed for simplicity. Add it later
   */
  const token = generateJwt({ user });

  res.status(200).send({
    id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
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
    let user = await findUser({ email });
    if (_isEmpty(user)) {
      user = addUser({ name, email });
    }
    const token = generateJwt({ user });

    res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (e) {
    return next({ statusCode: 500, message: e.message });
  }
};

//No need to verify token for SPA
const microsoftSignIn = async (req, res, next) => {
  const { idToken } = req.body;

  try {
    const { preferred_username: email, name } = jwt.decode(idToken);

    let user = await findUser({ email });
    if (_isEmpty(user)) {
      user = addUser({ name, email });
    }
    const token = generateJwt({ user });

    res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
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
    user = await findUser({ email });
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
    const user = await findUser({ _id: userId });

    if (_isEmpty(user)) {
      return next({ statusCode: 404, message: 'User does not exist!' });
    }

    const encryptedPassword = bcrypt.hashSync(password, 8);

    const updatedUser = await findOneAndUpdateUser(
      { _id: userId },
      { password: encryptedPassword, showResetPasswordFlow: false },
      { new: true }
    );

    const token = generateJwt({ user: updatedUser });

    res.status(200).send({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token,
    });
  } catch (e) {
    return next({ statusCode: 500, message: e.message });
  }
};

module.exports = {
  signin,
  signup,
  resetPassword,
  changePassword,
};
