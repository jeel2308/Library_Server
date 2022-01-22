const { MongoDataSource } = require('apollo-datasource-mongodb');

class LinkDataStore extends MongoDataSource {
  addLink = async ({ url, folderId,isCompleted=false }) => {
    const Link = this.model;
    
    const linkDocument = new Link({ url, folderId, isCompleted });
    const res = await linkDocument.save();
    return res;
  }
  updateLink = async (payload) => {
    const { id, ...newData } = payload;
    const Link = this.model;
    const res = await Link.findOneAndUpdate({ _id: id }, newData, { new: true });
    return res;
  }
  deleteLink = async ({ linkId }) => {
    const Link = this.model;
    const res = await Link.findOneAndDelete({ _id: linkId }, { new: true });
    return res;
  }
}

module.exports = LinkDataStore;
