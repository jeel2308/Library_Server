const sendGmail = async ({
  from = process.env.EMAIL,
  to,
  body,
  subject,
  attachments,
}) => {
  await global.gmailTransporter.sendMail({
    from,
    to,
    subject,
    html: body,
    attachments,
  });
};

module.exports = { sendGmail };
