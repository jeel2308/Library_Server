/**--external-- */
const nodemailer = require('nodemailer');

const initMailTransporter = () => {
  const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL, pass: process.env.EMAIL_WINDOWS_PASS },
  });
  const transporterV2 = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.GOOGLE_AUTH_CLIENT_EMAIL,
      pass: process.env.GOOGLE_AUTH_CLIENT_PASSWORD,
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_AUTH_REFRESH_TOKEN,
    },
  });

  global.gmailTransporter = gmailTransporter;
  global.transporterV2 = transporterV2;
};

module.exports = initMailTransporter;
