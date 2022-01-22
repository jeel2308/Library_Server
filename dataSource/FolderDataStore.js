const { MongoDataSource } = require('apollo-datasource-mongodb');

class FolderDataSource extends MongoDataSource { 
    addFolder = async ({ name, userId }) => {
        const Folder = this.model;
        const folderDoc = new Folder({ name, userId });
        const res = await folderDoc.save();
        console.log(res);
        return res;
    }
}

module.exports = FolderDataSource;