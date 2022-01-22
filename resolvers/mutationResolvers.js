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
    }
}

module.exports = resolvers;