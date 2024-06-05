const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // INPUT_REQUIRED {your email address for nodemailer}
    pass: process.env.EMAIL_PASS, // INPUT_REQUIRED {your email password for nodemailer}
  },
});

async function sendAlertEmail(userEmail, message) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Suspicious Activity Detected',
      text: message,
    });
    console.log(`Alert email sent to ${userEmail}`);
  } catch (error) {
    console.error('Failed to send alert email:', error.message);
    console.error(error.stack);
  }
}

module.exports = { sendAlertEmail };