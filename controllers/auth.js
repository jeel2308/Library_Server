/**--external-- */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const _isEmpty = require('lodash/isEmpty');

/**--internal-- */
const { User } = require('../models');
const callService = require('../services');

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
    console.log(e);
    res.status(500).send({});
  }
};

const signin = async (req, res) => {
  const { JWT_SECRET, JWT_EXPIRE_DURATION } = process.env;

  let user = undefined;

  const { email, password } = req.body;

  try {
    user = await User.findOne({ email });
  } catch (e) {
    res.status(500).send({});
    return;
  }

  if (!user) {
    res.status(404).send({ message: 'User not found', success: false });
    return;
  }

  const isValidPassword = bcrypt.compareSync(password, user.password);

  if (!isValidPassword) {
    res.status(500).send({ message: 'Incorrect password', success: false });
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
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);

  res.status(200).send({
    id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
};

const resetPassword = async (req, res) => {
  const { email } = req.body;

  let user = null;

  try {
    user = await User.findOne({ email });
    if (_isEmpty(user)) {
      res.status(200).send({ message: 'User does not exist' });
      return;
    }

    const newPassword = callService({
      type: 'RESET_PASSWORD',
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
  const { id: userId, password } = req.body;

  try {
    const user = await User.find({ _id: userId });

    if (_isEmpty(user)) {
      res.status(404).send({ message: 'User does not exist!' });
      return;
    }

    const encryptedPassword = bcrypt.hashSync(password, 8);

    await User.findOneAndUpdate(
      { _id: userId },
      { password: encryptedPassword },
      { new: true }
    );

    res.status(200).send({ message: `Updated password` });
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
