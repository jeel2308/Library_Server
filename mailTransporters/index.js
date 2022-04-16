/**--external-- */
const nodemailer = require('nodemailer');

const initMailTransporter = () => {
  const gmailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
  });

  global.gmailTransporter = gmailTransporter;
};

module.exports = initMailTransporter;
