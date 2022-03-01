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
  return _pick(metadata, ['url', 'description', 'image']);
};

module.exports = { getMetadata };
