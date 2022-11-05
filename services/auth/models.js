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

const RefreshTokenSchema = new Schema({
  refreshToken: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },
});

const User = mongoose.model('user', UserSchema);

const RefreshTokenModel = mongoose.model('refresh_token', RefreshTokenSchema);

module.exports = { User, RefreshToken: RefreshTokenModel };
