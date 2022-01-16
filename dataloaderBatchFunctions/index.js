const getBatchLoaderFunctionForUsers = (dataSource) => {
  return async (keys) => {
    try {
      const users = await dataSource.findManyByIds(keys);
      return users;
    } catch (e) {
      console.log(e);
    }
  };
};

module.exports = { getBatchLoaderFunctionForUsers };
