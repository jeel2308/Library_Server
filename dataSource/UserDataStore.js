const { MongoDataSource } = require('apollo-datasource-mongodb');

class UserDataStore extends MongoDataSource {
  getUsersById = async ({ ids }) => {};
}

module.exports = { UserDataStore };
