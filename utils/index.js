const encodeToBase64 = ({ text }) => {
  return Buffer.from(text).toString('base64');
};

const decodeFromBase64 = ({ text }) => {
  return Buffer.from(text, 'base64').toString('ascii');
};

module.exports = { encodeToBase64, decodeFromBase64 };
