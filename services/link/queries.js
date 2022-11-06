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
  const res = await Link.find(...params);
  return res.map(({ _doc }) => _doc);
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

  const res = await queryObj;
  return res.map(({ _doc }) => _doc);
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

const deleteMultipleLinks = async (allOperations) => {
  const payload = _map(allOperations, (data) => {
    const { filter } = data;
    return {
      deleteOne: {
        filter,
      },
    };
  });

  return await Link.bulkWrite(payload);
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
