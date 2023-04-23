const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //create a transpot
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //define the email options
  const mailOptions = {
    from: 'Ramovies<jif70@pitt.edu',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
