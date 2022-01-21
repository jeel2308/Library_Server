const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FolderSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Folder = mongoose.model('folder', FolderSchema);

export default Folder;
