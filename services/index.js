const { sendGmail, sendMailV2 } = require('./emailGenerator');

const callService = ({ type, data }) => {
  switch (type) {
    /**--deprecated service-- */
    case 'SEND_EMAIL_FROM_GMAIL': {
      return sendGmail(data);
    }
    case 'SEND_EMAIL_V2': {
      return sendMailV2(data);
    }

    default: {
      return null;
    }
  }
};

module.exports = callService;
