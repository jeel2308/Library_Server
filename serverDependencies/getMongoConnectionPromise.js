/**--external-- */
const mongoose = require('mongoose');

const getMongoConnectionPromise = () => {
  const { PASSWORD, DB } = process.env;
  const DB_URL = `mongodb+srv://Jeel2308:${PASSWORD}@cluster0.erkx1.mongodb.net/${DB}?retryWrites=true&w=majority`;

  return mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = { getMongoConnectionPromise };
