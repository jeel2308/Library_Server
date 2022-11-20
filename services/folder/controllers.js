const _map = require('lodash/map');
const {
  findMultipleFolders,
  addFolder,
  updateFolder,
  deleteFolder,
  aggregateFolders,
} = require('./queries');
const { deleteLinksByFolderId } = require('../link/controllers');

const findMultipleFoldersById = async ({ ids }) => {
  return await findMultipleFolders({ _id: { $in: ids } });
};

/**
 * @deprecated
 */
const findMultipleFoldersByUserId = async ({ userId }) => {
  return await findMultipleFolders({ userId });
};

/**
 * @deprecated
 */
const findFolderById = async ({ id }) => {
  const [folder] = await findMultipleFolders({ _id: id });
  return folder;
};

const addFolderByUserId = async (folderDetails) => {
  const { userId, ...otherDetails } = folderDetails;
  return await addFolder({ userId, ...otherDetails });
};

const updateFolderById = async ({ id, ...otherUpdates }) => {
  return await updateFolder({ _id: id }, otherUpdates, { new: true });
};

const deleteFolderById = async ({ id }) => {
  const folder = await deleteFolder({ _id: id });
  await deleteLinksByFolderId({ folderId: id });
  return folder;
};

const aggregateFolderIdsByUserIds = async ({ userIds }) => {
  /**
   * Normalization is needed as userId can be string or ObjectId.
   * Mongoose is not handling String and ObjectId comparison in aggregates
   */
  const normalizedUserIds = _map(userIds, (id) => id.toString());

  return await aggregateFolders([
    { $match: { userId: { $in: normalizedUserIds } } },
    {
      $group: {
        _id: '$userId',
        folders: { $push: { _id: '$_id' } },
      },
    },
  ]);
};

module.exports = {
  findMultipleFoldersById,
  findMultipleFoldersByUserId,
  findFolderById,
  addFolderByUserId,
  updateFolderById,
  deleteFolderById,
  aggregateFolderIdsByUserIds,
};
