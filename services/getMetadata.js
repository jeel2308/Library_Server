const got = require('got');
const _pick = require('lodash/pick');

const metascraper = require('metascraper')([
  require('metascraper-title')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
]);

const getMetadata = async ({ url }) => {
  const { body: html } = await got(url);
  const metascraperPromise = metascraper({ html, url });

  let metadata;
  try {
    const timeOutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ title: null, image: null, description: null });
      }, 2000);
    });
    metadata = await Promise.race([metascraperPromise, timeOutPromise]);
  } catch (e) {
    console.error(e);
    metadata = { title: null, image: null, description: null };
  }
  const updatedMetadata = { ...metadata, thumbnail: metadata.image };
  return _pick(updatedMetadata, ['title', 'description', 'thumbnail']);
};

module.exports = { getMetadata };
