const { MongoDataSource } = require('apollo-datasource-mongodb');

class UserDataStore extends MongoDataSource {
  updateUser = async (payload) => {
    const { id, ...otherDetails } = payload;

    const User = this.model;

    const result = await User.findByIdAndUpdate({ _id: id }, otherDetails, {
      new: true,
    });

    return result;
  };
}

module.exports = { UserDataStore };
