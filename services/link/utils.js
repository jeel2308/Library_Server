const { ObjectId } = require('mongodb');
const _omit = require('lodash/omit');

const { decodeFromBase64 } = require('../../utils');

const generatePaginationFilters = ({ filters, folderId }) => {
  const updatedFilters = {
    ..._omit(filters, ['after', 'first', 'searchText']),
    folderId,
  };

  const { after, searchText } = filters;

  if (after) {
    const cursor = decodeFromBase64({ text: after });
    updatedFilters._id = { $lt: ObjectId(cursor) };
  }

  if (searchText) {
    updatedFilters.$or = [
      { title: { $regex: searchText, $options: 'i' } },
      { url: { $regex: searchText, $options: 'i' } },
    ];
  }

  return updatedFilters;
};

module.exports = { generatePaginationFilters };
