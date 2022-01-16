/**--external-- */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**--internal-- */
const { User } = require('../models');

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

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE_DURATION,
  });

  res
    .status(200)
    .send({ success: true, id: user.id, email: user.email, token });
};

module.exports = {
  signin,
  signup,
};
