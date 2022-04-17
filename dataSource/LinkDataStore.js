const _map = require('lodash/map');
const _omit = require('lodash/omit');
const _isUndefined = require('lodash/isUndefined');

const { MongoDataSource } = require('apollo-datasource-mongodb');

const { getMetadata } = require('../scraper');
const { ObjectId } = require('mongodb');
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
    console.log({ oldPayload: payload });
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
  findLinksV2 = async (payload) => {
    const { folderId, filters } = payload;
    const Link = this.model;
    const { first, searchText, after, isCompleted } = filters;
    const updatedFilters = {
      folderId,
    };

    if (!_isUndefined(isCompleted)) {
      updatedFilters.isCompleted = isCompleted;
    }

    if (!_isUndefined(searchText)) {
      updatedFilters.$or = [
        { title: { $regex: searchText, $options: 'i' } },
        { url: { $regex: searchText, $options: 'i' } },
      ];
    }

    if (!_isUndefined(after)) {
      updatedFilters._id = { $lt: ObjectId(after) };
    }

    let query = Link.find(updatedFilters).sort({ _id: 'desc' });

    if (!_isUndefined(first)) {
      query = query.limit(first);
    }

    const response = await query;

    return _map(response, ({ _doc }) => _doc);
  };
  getTotalLinks = async (payload) => {
    const Link = this.model;

    const updatedFilters = _omit(payload, ['searchText']);

    const { searchText } = payload;

    if (!_isUndefined(searchText)) {
      updatedFilters.$or = [
        { title: { $regex: searchText, $options: 'i' } },
        { url: { $regex: searchText, $options: 'i' } },
      ];
    }

    const totalLinks = await Link.count(updatedFilters);
    return totalLinks;
  };
  getNextLinkPresenceStatus = async (payload) => {
    const { linkId, folderId, isCompleted, searchText } = payload;
    const Link = this.model;

    const updatedFilters = { _id: { $lt: ObjectId(linkId) }, folderId };

    if (!_isUndefined(isCompleted)) {
      updatedFilters.isCompleted = isCompleted;
    }

    if (!_isUndefined(searchText)) {
      updatedFilters.$or = [
        { title: { $regex: searchText, $options: 'i' } },
        { url: { $regex: searchText, $options: 'i' } },
      ];
    }

    const nextLink = await Link.exists(updatedFilters);

    return nextLink;
  };
}

module.exports = LinkDataStore;
