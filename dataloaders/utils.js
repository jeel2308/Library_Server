const _reduce = require('lodash/reduce');
const _map = require('lodash/map');
const _identity = require('lodash/identity');

/**
 *
 * @param {Object} param0
 * @param {Array} param0.keys Array of data loader keys
 * @param {Function} param0.keyFunction Function to calculate key for each item of result
 * @param {Function} param0.mappingFunction Function to select specific data from each item of result
 * @param {Array} param0.result - Result from db
 * @returns Array - result sorted by keys
 */
const mapKeyToResult = ({ keys, keyFunction, result, mappingFunction }) => {
  const updatedMappingFunction = mappingFunction ? mappingFunction : _identity;
  const resultByKeys = _reduce(
    result,
    (acc, current) => {
      return {
        ...acc,
        [keyFunction(current)]: updatedMappingFunction(current),
      };
    },
    {}
  );

  return _map(keys, (key) => resultByKeys[key]);
};

module.exports = { mapKeyToResult };
