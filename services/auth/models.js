const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  id: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
  profileUrl: {
    type: String,
  },
  showResetPasswordFlow: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('user', UserSchema);

module.exports = { User };
