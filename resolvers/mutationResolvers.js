const resolvers = {
    addFolder: async (parent, args, context) => {
        try {
            const { input: { name } } = args;
            const { dataSources: { folders }, user } = context;
            const userId = user._id;
            const {_doc} = await folders.addFolder({ name, userId });
            
            return { folder:_doc, success: true };
        } catch (e) {
            return {success:false,folder:null}
        }
    },
    updateFolder: async (_, args, context) => {
        try {
            const { input } = args;
            const { dataSources: { folders } } = context;
            const { _doc} = await folders.updateFolder(input);
            
            return {folder:_doc,success:true}
        }
        catch (e) {
            return {success:false,folder:null}
        }
    },
    deleteFolder: async (_, args, context) => {
        try {
            const { input: { id } } = args;
            const { dataSources: { links, folders } } = context;
            const deleteFolderAndLinksPromise = Promise.all([folders.deleteFolder({ folderId: id }), links.deleteManyLinks({ folderId: id })]);
            /**
             * Here we are not returning deleted links because there is no optimal
             * way to delete and return multiple documents in mongodb
             */
            const [folderQuery] = await deleteFolderAndLinksPromise;
            const { _doc } = folderQuery;
          
            return {success:true,folder:_doc}
        }
        catch (e) {
            return { success: false, folder: null }
        }
    },
    addLink: async (_, args, context) => {
        try {
            const { input:{url,folderId,isCompleted} } = args;
            const { dataSources: { links } } = context;
            const { _doc } = await links.addLink({ url, folderId, isCompleted });

            return {link:_doc,success:true}
        }
        catch (e) {
            console.log(e);
            return {success:false,link:null}
        }
    },
    updateLink: async (_, args, context) => {
        try {
            const { input } = args;
            const { dataSources: { links } } = context;
            const { _doc } = await links.updateLink(input);

            return {link:_doc,success:true}
        }
        catch (e) {
            console.log(e);
            return {success:false,link:null}
        }
    },
    deleteLink: async (_, args, context) => {
        try {
            const { input: { id } } = args;
            const { dataSources: { links } } = context;
            const { _doc } = await links.deleteLink({ linkId: id });
            return {success:true,link:_doc}
        }
        catch (e) {
            console.log(e);
            return {success:false,link:null}
        }
    }
}

module.exports = resolvers;