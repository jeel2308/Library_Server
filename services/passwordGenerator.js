const generatePassword = ({ length }) => {
  return Math.random()
    .toString(20)
    .substring(2, 2 + length);
};

module.exports = generatePassword;
