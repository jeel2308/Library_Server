const { MongoDataSource } = require('apollo-datasource-mongodb');

class FolderDataSource extends MongoDataSource { 
    addFolder = async ({ name, userId }) => {
        const Folder = this.model;
        const folderDoc = new Folder({ name, userId });
        const res = await folderDoc.save();
        return res;
    }
    updateFolder = async (payload) => {
        const { id: folderId, ...newData } = payload;
        const Folder = this.model;
        /**
         * {new:true} is required to return updated data. If data before update is needed, then don't pass it
         */
        const res = await Folder.findOneAndUpdate({ _id: folderId }, newData,{new:true});
        return res;
    }
}

module.exports = FolderDataSource;