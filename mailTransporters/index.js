/**--external-- */
const nodemailer = require('nodemailer');

const initMailTransporter = () => {
  const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL, pass: process.env.EMAIL_WINDOWS_PASS },
  });

  global.gmailTransporter = gmailTransporter;
};

module.exports = initMailTransporter;
