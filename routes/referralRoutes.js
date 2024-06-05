const express = require('express');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Endpoint to send a referral email
router.post('/send-referral', async (req, res) => {
  const { email } = req.body;
  const user = await User.findById(req.session.userId);
  const referralLink = `${process.env.APP_BASE_URL}/register?referral=${user.referralCode}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Join 42Matters and start earning today!',
      html: `Hello,<br><br>Join me on 42Matters and start managing your cryptocurrency effectively.<br><a href="${referralLink}">Click here to sign up</a><br><br>Best,<br>${user.username}`,
    });
    console.log(`Referral email sent successfully to ${email}.`);
    res.send('Referral email sent successfully.');
  } catch (error) {
    console.error('Failed to send referral email:', error);
    console.error(error.stack);
    res.status(500).send('Failed to send referral email.');
  }
});

// Endpoint to handle referral signups
router.post('/register-with-referral', async (req, res) => {
  const { username, password, referralCode } = req.body;
  try {
    const referringUser = await User.findOne({ referralCode: referralCode });
    if (!referringUser) {
      console.log(`Invalid referral code used: ${referralCode}`);
      return res.status(400).send('Invalid referral code.');
    }

    const newUser = await User.create({ username, password, referredBy: referringUser._id });
    referringUser.referrals.push(newUser._id);
    referringUser.rewards += 10; // Add a reward for successful referral
    await referringUser.save().catch(error => {
      console.error('Failed to save referring user after adding referral:', error);
      console.error(error.stack);
    });

    console.log(`New user ${username} registered with referral from ${referringUser.username}. Reward credited.`);
    // Automatically log in the new user (or redirect as needed)
    req.session.userId = newUser._id;
    res.redirect('/'); // Redirect to the home page or dashboard
  } catch (error) {
    console.error('Error handling referral signup:', error);
    console.error(error.stack);
    res.status(500).send('Failed to complete referral signup.');
  }
});

module.exports = router;