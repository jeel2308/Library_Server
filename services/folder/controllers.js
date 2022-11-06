const {
  findMultipleFolders,
  addFolder,
  updateFolder,
  deleteFolder,
} = require('./queries');
const { deleteLinksByFolderId } = require('../link/controllers');

const findMultipleFoldersById = async ({ ids }) => {
  return await findMultipleFolders({ _id: { $in: ids } });
};

const findMultipleFoldersByUserId = async ({ userId }) => {
  return await findMultipleFolders({ userId });
};

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

module.exports = {
  findMultipleFoldersById,
  findMultipleFoldersByUserId,
  findFolderById,
  addFolderByUserId,
  updateFolderById,
  deleteFolderById,
};
