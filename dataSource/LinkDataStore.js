const _map = require('lodash/map');

const { MongoDataSource } = require('apollo-datasource-mongodb');

const { getMetadata } = require('../scraper');
class LinkDataStore extends MongoDataSource {
  addLink = async ({ url, folderId, isCompleted = false }) => {
    const Link = this.model;

    const linkDocument = new Link({ url, folderId, isCompleted });
    const res = await linkDocument.save();
    return res;
  };
  updateLink = async (payload) => {
    const Link = this.model;
    const linkIds = _map(payload, ({ id }) => id);

    const bulkWritePayload = _map(payload, ({ id, ...newData }) => {
      return {
        updateOne: {
          filter: { _id: id },
          update: newData,
        },
      };
    });

    await Link.bulkWrite(bulkWritePayload);

    const result = await this.findManyByIds(linkIds);

    return result;
  };
  deleteLink = async (payload) => {
    const Link = this.model;
    const linkIds = _map(payload, ({ id }) => id);

    const result = await this.findManyByIds(linkIds);

    const bulkWritePayload = _map(linkIds, (id) => {
      return {
        deleteOne: {
          filter: { _id: id },
        },
      };
    });

    await Link.bulkWrite(bulkWritePayload);

    return result;
  };
  deleteManyLinks = async (payload) => {
    const Link = this.model;
    const res = await Link.deleteMany(payload, { new: true });
    return res;
  };
  findLinks = async (payload) => {
    const Link = this.model;
    const res = await Link.find(payload);
    return res;
  };
  updateLinksMetadata = async (payload) => {
    const linkIds = _map(payload, ({ id }) => id);

    const metadataPromises = _map(payload, ({ url }) => {
      return getMetadata({ url });
    });

    const metadataList = await Promise.all(metadataPromises);

    const Link = this.model;

    const bulkWritePayload = _map(payload, ({ id }, index) => {
      return {
        updateOne: {
          filter: { _id: id },
          update: metadataList[index],
        },
      };
    });

    await Link.bulkWrite(bulkWritePayload);

    const result = await this.findManyByIds(linkIds);

    return _map(result, ({ _doc }) => _doc);
  };
}

module.exports = LinkDataStore;
