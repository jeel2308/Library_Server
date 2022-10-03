/**--external-- */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _isEmpty = require('lodash/isEmpty');
const { OAuth2Client } = require('google-auth-library');
const fetch = require('node-fetch');

/**--internal-- */
const { User } = require('../models');
const callService = require('../services');

const googleAuthClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const user = new User({
    name,
    email,
    password: bcrypt.hashSync(password, 8),
  });

  try {
    await user.save();
    res.status(200).send();
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const localSignIn = async (req, res) => {
  const { email, password } = req.body;
  const { JWT_SECRET } = process.env;

  let user = undefined;

  try {
    user = await User.findOne({ email });
  } catch (e) {
    res.status(500).send({ message: e.message });
    return;
  }

  if (!user) {
    res.status(404).send({ message: 'User does not exist' });
    return;
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);

  if (!isValidPassword) {
    res.status(500).send({ message: 'Incorrect password' });
    return;
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
  const token = jwt.sign({ id: user._id }, JWT_SECRET);

  res.status(200).send({
    id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
};

const googleSignIn = async (req, res) => {
  const { idToken } = req.body;
  const { JWT_SECRET, GOOGLE_CLIENT_ID } = process.env;

  try {
    const loginTicket = await googleAuthClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const { name, email } = loginTicket.getPayload();
    let user = await User.findOne({ email });
    if (_isEmpty(user)) {
      user = new User({
        name,
        email,
      });
      await user.save();
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
    return;
  }
};

//No need to verify token for SPA
const microsoftSignIn = async (req, res) => {
  const { idToken } = req.body;
  const { JWT_SECRET } = process.env;

  try {
    const { preferred_username: email, name } = jwt.decode(idToken);

    let user = await User.findOne({ email });
    if (_isEmpty(user)) {
      user = new User({
        name,
        email,
      });
      await user.save();
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);

    res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
    return;
  }
};

const signin = async (req, res) => {
  const { method } = req.body;

  switch (method) {
    case 'local': {
      await localSignIn(req, res);
      break;
    }
    case 'google': {
      await googleSignIn(req, res);
      break;
    }
    case 'microsoft': {
      await microsoftSignIn(req, res);
      break;
    }
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;

  let user = null;

  try {
    user = await User.findOne({ email });
    if (_isEmpty(user)) {
      res.status(404).send({ message: 'User does not exist!' });
      return;
    }

    const newPassword = callService({
      type: 'GENERATE_PASSWORD',
      data: { length: 10 },
    });

    await User.findOneAndUpdate(
      { email },
      {
        password: bcrypt.hashSync(newPassword, 8),
        showResetPasswordFlow: true,
      },
      { new: true }
    );

    await callService({
      type: 'SEND_EMAIL_FROM_GMAIL',
      data: {
        to: email,
        subject: 'Reset password',
        body: `<p>We have received request for resetting your password.</p>
        <p>Your temporary password is <b>${newPassword}</b></p>
        <p>Sign in with this password and set your new password</p> 
        `,
      },
    });

    res.status(200).send({ message: 'email sent' });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

const changePassword = async (req, res) => {
  const { JWT_SECRET } = process.env;

  const { id: userId, password } = req.body;

  try {
    const user = await User.find({ _id: userId });

    if (_isEmpty(user)) {
      res.status(404).send({ message: 'User does not exist!' });
      return;
    }

    const encryptedPassword = bcrypt.hashSync(password, 8);

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      { password: encryptedPassword, showResetPasswordFlow: false },
      { new: true }
    );

    const token = jwt.sign({ id: updatedUser._id }, JWT_SECRET);

    res.status(200).send({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token,
    });
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
};

module.exports = {
  signin,
  signup,
  resetPassword,
  changePassword,
};
