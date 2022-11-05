const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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

const RefreshTokenModel = mongoose.model('refresh_token', RefreshTokenSchema);

module.exports = RefreshTokenModel;
