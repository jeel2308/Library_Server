const generatePassword = require('./passwordGenerator');

const callService = ({ type, data }) => {
  switch (type) {
    case 'RESET_PASSWORD': {
      return generatePassword(data);
    }
    default: {
      return null;
    }
  }
};

module.exports = callService;
