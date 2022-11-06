const _map = require('lodash/map');
const _filter = require('lodash/filter');
const _isEmpty = require('lodash/isEmpty');
const _reduce = require('lodash/reduce');

const {
  addSingleLink,
  findMultipleLinks,
  updateMultipleLinks,
  deleteMultipleLinks,
  findMultipleLinksForPagination,
  getCountOfLinks,
  checkLinkExistence,
} = require('./queries');

const { generatePaginationFilters } = require('./utils');

const { getMetadata } = require('../getMetadata');

const addSingleLinkByFolderId = async ({
  url,
  folderId,
  isCompleted = false,
}) => {
  const metadata = await getMetadata({ url });
  return await addSingleLink({ url, folderId, isCompleted, ...metadata });
};

const updateLinksById = async (links) => {
  const linksWithUrlUpdate = _filter(links, (link) => !!link.url);

  let updatedLinks = links;

  if (!_isEmpty(linksWithUrlUpdate)) {
    const allLinksMetadataPromises = _map(linksWithUrlUpdate, ({ url }) =>
      getMetadata({ url })
    );
    const allLinksMetadata = await Promise.all(allLinksMetadataPromises);
    const metadataToLinkMapping = _reduce(
      linksWithUrlUpdate,
      (result, { id }, index) => {
        return { ...result, [id]: allLinksMetadata[index] };
      },
      {}
    );
    updatedLinks = _map(links, ({ id, ...rest }) => {
      return { id, ...rest, ...metadataToLinkMapping[id] };
    });
  }

  const allUpdateOperations = _map(updatedLinks, ({ id, ...otherUpdates }) => {
    return {
      filter: { _id: id },
      update: otherUpdates,
    };
  });

  await updateMultipleLinks(allUpdateOperations);

  /**
   * Mongodb does not return updated multiple documents.
   * So, we need to fetch them explicitly
   */
  const linkIds = _map(updatedLinks, ({ id }) => id);
  return await findMultipleLinks({ _id: { $in: linkIds } });
};

const deleteLinksById = async (links) => {
  /**
   * Mongodb does not return deleted multiple documents.
   * So, we need to fetch them explicitly
   */
  const linksIds = _map(links, ({ id }) => id);
  const linksToBeDeleted = findMultipleLinks({ _id: { $in: linksIds } });

  const allDeleteOperations = _map(links, ({ id }) => {
    return {
      filter: { _id: id },
    };
  });

  await deleteMultipleLinks(allDeleteOperations);
  return linksToBeDeleted;
};

const findLinkById = async ({ id }) => {
  const [link] = await findMultipleLinks({ _id: id });
  return link;
};

const findLinksByIds = async ({ ids }) => {
  return await findMultipleLinks({ _id: { $in: ids } });
};

const findLinksByFolderId = async ({ folderId }) => {
  return await findMultipleLinks({ folderId });
};

const findLinksByFilters = async ({ folderId, filters }) => {
  const paginationFilters = generatePaginationFilters({ filters, folderId });

  return await findMultipleLinksForPagination(
    paginationFilters,
    '*',
    { _id: 'desc' },
    filters.first
  );
};

const getTotalLinkCountsByFilters = async ({ folderId, filters }) => {
  const paginationFilters = generatePaginationFilters({ folderId, filters });

  return await getCountOfLinks(paginationFilters);
};

const getNextLinkPresenceStatus = async ({ folderId, filters, cursor }) => {
  const updatedFilters = { ...filters, after: cursor };
  const paginationFilters = generatePaginationFilters({
    filters: updatedFilters,
    folderId,
  });

  return await checkLinkExistence(paginationFilters);
};

module.exports = {
  addSingleLinkByFolderId,
  updateLinksById,
  deleteLinksById,
  findLinkById,
  findLinksByIds,
  findLinksByFolderId,
  findLinksByFilters,
  getTotalLinkCountsByFilters,
  getNextLinkPresenceStatus,
};
