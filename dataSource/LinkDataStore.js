const { MongoDataSource } = require('apollo-datasource-mongodb');

class LinkDataStore extends MongoDataSource {
  addLink = async ({ url, folderId,isCompleted=false }) => {
    const Link = this.model;
    
    const linkDocument = new Link({ url, folderId, isCompleted });
    const res = await linkDocument.save();
    return res;
  }
}

module.exports = LinkDataStore;
