const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ResourceSchema = new Schema({
  id: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  tag: {
    type: String,
  },
  description: {
    type: String,
  },
  userId: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});

const Resource = mongoose.model('resource', ResourceSchema);

module.exports = { Resource };
