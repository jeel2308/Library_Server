const resolvers = {
    addFolder: async (parent, args, context) => {
        const { input:{name} } = args;
        const { dataSources: { folders },user } = context;
        const userId = user._id;
        const res = await folders.addFolder({ name, userId });
        return res;
    }
}

module.exports = resolvers;