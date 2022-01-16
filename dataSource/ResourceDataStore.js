const { MongoDataSource } = require('apollo-datasource-mongodb');

class ResourceDataStore extends MongoDataSource {
  getResourceById() {
    console.log('Resource Id');
  }
}

module.exports = { ResourceDataStore };
