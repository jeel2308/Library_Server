const Link = require('./models');
const _isEmpty = require('lodash/isEmpty');
const _map = require('lodash/map');

const addSingleLink = async (params) => {
  const link = new Link(params);
  link.save();
  return link;
};

const findMultipleLinks = async (filter, projection) => {
  const params = _isEmpty(projection) ? [filter] : [filter, projection];
  return await Link.find(...params).lean();
};

const findMultipleLinksForPagination = async (
  filter,
  projection = '*',
  sortOptions,
  limit
) => {
  const params = projection === '*' ? [filter] : [filter, projection];
  const queryObj = Link.find(...params).sort(sortOptions);

  if (limit) {
    queryObj.limit(limit);
  }

  return await queryObj.lean();
};

const updateMultipleLinks = async (allOperations) => {
  const payload = _map(allOperations, (data) => {
    const { filter, update } = data;
    return {
      updateOne: {
        filter,
        update,
      },
    };
  });

  return await Link.bulkWrite(payload);
};

const deleteMultipleLinks = async (filter) => {
  return await Link.deleteMany(filter);
};

const getCountOfLinks = async (filter) => {
  return await Link.count(filter);
};

const checkLinkExistence = async (filter) => {
  return !!(await Link.exists(filter));
};

module.exports = {
  addSingleLink,
  deleteMultipleLinks,
  findMultipleLinks,
  updateMultipleLinks,
  getCountOfLinks,
  checkLinkExistence,
  findMultipleLinksForPagination,
};
