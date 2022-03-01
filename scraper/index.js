const got = require('got');
const _pick = require('lodash/pick');

const metascraper = require('metascraper')([
  require('metascraper-title')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
]);

const getMetadata = async ({ url }) => {
  const { body: html } = await got(url);
  const metadata = await metascraper({ html, url });
  const updatedMetadata = { ...metadata, thumbnail: metadata.image };
  return _pick(updatedMetadata, ['title', 'description', 'thumbnail']);
};

module.exports = { getMetadata };
