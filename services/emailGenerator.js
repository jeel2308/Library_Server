/**
 *
 * @deprecated
 */
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

const sendMailV2 = async ({
  from = process.env.GOOGLE_AUTH_CLIENT_EMAIL,
  to,
  body,
  subject,
  attachments,
}) => {
  await global.transporterV2.sendMail({
    from,
    to,
    subject,
    html: body,
    attachments,
  });
};

module.exports = { sendGmail, sendMailV2 };
