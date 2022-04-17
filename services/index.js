const generatePassword = require('./passwordGenerator');

const { sendGmail } = require('./emailGenerator');

const callService = ({ type, data }) => {
  switch (type) {
    case 'GENERATE_PASSWORD': {
      return generatePassword(data);
    }
    case 'SEND_EMAIL_FROM_GMAIL': {
      return sendGmail(data);
    }

    default: {
      return null;
    }
  }
};

module.exports = callService;
