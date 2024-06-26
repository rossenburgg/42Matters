const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const router = express.Router();
const Notification = require('../models/Notification');
const isAdmin = require('./middleware/isAdminMiddleware');
const toastr = require('toastr'); // Import Toastr library

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

router.get('/auth/register', (req, res) => {
  const messages = { errorMessage: req.session.errorMessage };
  req.session.errorMessage = null;
  res.render('register', messages);
});

router.post('/auth/register', async (req, res) => {
  try {
    const { username, phone, password, confirmPassword, gender, referralCode, termsAccepted } = req.body;
    if (password !== confirmPassword) {
      req.session.errorMessage = 'Passwords do not match.';
      return res.redirect('/auth/register');
    }
    if (!termsAccepted || termsAccepted !== 'on') {
      req.session.errorMessage = 'You must accept the terms and conditions.';
      return res.redirect('/auth/register');
    }
    const existingUser = await User.findOne({ $or: [{ username }, { phone }] });
    if (existingUser) {
      req.session.errorMessage = 'User with the given username or phone already exists.';
      return res.redirect('/auth/register');
    }
    let referringUser = null;
    if (referralCode) {
      referringUser = await User.findOne({ referralCode });
      if (!referringUser) {
        req.session.errorMessage = 'Invalid referral code.';
        return res.redirect('/auth/register');
      }
    }
    const newUser = await User.create({ username, phone, password, gender, termsAccepted: true });
    if (referringUser) {
      referringUser.rewards += 10; // Adjust reward value as per your logic
      referringUser.referrals.push(newUser._id);
      await referringUser.save();
    }

    // Send welcome notification
    await Notification.createNotification(newUser._id, 'Welcome to 42Matters! Your account has been successfully created.');

    req.session.successMessage = 'Registration successful! Please log in.'; // Setting a success message
    res.redirect('/auth/login'); // Redirect to login with success message
  } catch (error) {
    console.error('Registration error:', error);
    console.error(error.stack);
    res.status(500).send(error.message);
  }
});

router.get('/auth/login', (req, res) => {
  const messages = { errorMessage: req.session.errorMessage, successMessage: req.session.successMessage };
  req.session.errorMessage = null;
  req.session.successMessage = null;
  res.render('login', messages);
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      req.session.errorMessage = 'Invalid username or password';
      return res.redirect('/auth/login');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.errorMessage = 'Invalid username or password';
      return res.redirect('/auth/login');
    }
    if (user.twoFactorSecret) {
      req.session.tempUserId = user._id; // Store user ID temporarily
      res.redirect('/auth/2fa');
    } else {
      req.session.userId = user._id;
      res.redirect('/');
    }
  } catch (error) {
    console.error('Login error:', error);
    console.error(error.stack);
    return res.status(500).send(error.message);
  }
});

router.get('/auth/setup2fa', async (req, res) => {
  if (!req.session.userId && !req.session.tempUserId) {
    return res.redirect('/auth/login');
  }
  try {
    const user = await User.findById(req.session.userId || req.session.tempUserId);
    if (user.twoFactorSecret) {
      res.render('setup2fa', { user, qrCodeUrl: null, twoFactorEnabled: true });
    } else {
      const secret = speakeasy.generateSecret({ length: 20 });
      req.session.tempSecret = secret.base32; // Store the secret temporarily in the session
      const otpauthUrl = speakeasy.otpauthURL({
        secret: secret.ascii,
        label: encodeURIComponent('42Matters:' + user.username),
        issuer: '42Matters',
        encoding: 'ascii'
      });
      qrcode.toDataURL(otpauthUrl, (err, dataUrl) => {
        if (err) {
          console.error('Error generating QR code:', err);
          console.error(err.stack);
          throw err;
        }
        res.render('setup2fa', { username:user.username, isAdmin:isAdmin, user, qrCodeUrl: dataUrl, twoFactorEnabled: false });
      });
    }
  } catch (error) {
    console.error('Error setting up 2FA:', error);
    console.error(error.stack);
    res.status(500).send('An error occurred during 2FA setup.');
  }
});

router.post('/auth/setup2fa/verify', async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.session.userId);
    const secret = req.session.tempSecret; // Use the secret stored in the session
    console.log(`Verifying 2FA token: ${token} with secret: ${secret} at time: ${new Date().toISOString()}`);
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 1
    });
    console.log(`2FA token verification result: ${verified}`);

    if (verified) {
      user.twoFactorSecret = secret;
      await user.save();
      delete req.session.tempSecret; // Clear the temporary secret from the session
      res.redirect('/');
    } else {
      res.status(401).send('Invalid 2FA token');
      toastr.error("Invalid 2FA token")
    }
  } catch (error) {
    console.error('2FA verification error:', error);
    console.error(error.stack);
    res.status(500).send('An error occurred during 2FA verification.');
  }
});

router.get('/auth/2fa', async (req, res) => {
  const user = await User.findById(req.session.tempUserId); // Use tempUserId for verification
  const isAdmin = user.isAdmin;
  if (!req.session.tempUserId) {
    return res.redirect('/auth/login');
  }

});


router.post('/auth/2fa/verify', async (req, res) => {
  if (!req.session.tempUserId) {
    console.error('Unauthorized 2FA verification attempt without tempUserId in session.');
    return res.status(401).send('Unauthorized access.');
  }
  try {
    const { token } = req.body;
    const user = await User.findById(req.session.tempUserId); // Use tempUserId for verification
    console.log(`Verifying 2FA token: ${token} for user: ${user.username} at time: ${new Date().toISOString()}`);
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: token,
      window: 1
    });
    console.log(`2FA token verification result: ${verified}`);

    if (verified) {
      req.session.userId = req.session.tempUserId; // Authenticate the user
      delete req.session.tempUserId; // Clear the temporary user ID
      res.redirect('/');
    } else {
      res.status(401).send('Invalid 2FA token');
    }
  } catch (error) {
    console.error('2FA verification error:', error);
    console.error(error.stack);
    res.status(500).send('An error occurred during 2FA verification.');
  }
});

router.post('/auth/disable2fa', async (req, res) => {
  if (!req.session.userId) {
    console.error('Unauthorized attempt to disable 2FA without being logged in.');
    return res.status(401).send('Unauthorized access.');
  }
  try {
    const { disableToken } = req.body;
    const user = await User.findById(req.session.userId);
    console.log(`Attempting to disable 2FA for user: ${user.username} with token: ${disableToken} at time: ${new Date().toISOString()}`);
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token: disableToken,
      window: 1
    });
    console.log(`2FA token verification result: ${verified}`);

    if (verified) {
      user.twoFactorSecret = undefined;
      await user.save();
      console.log(`2FA disabled for user: ${user.username}`);
      res.redirect('/auth/setup2fa');
    } else {
      console.error('Failed to disable 2FA: Invalid token');
      res.status(401).send('Invalid 2FA token');
    }
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    console.error(error.stack);
    res.status(500).send('An error occurred while disabling 2FA.');
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      console.error(err.stack);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/auth/login');
  });
});

// Password Reset Routes
router.get('/auth/forgot-password', (req, res) => {
  const messages = { errorMessage: req.session.errorMessage, successMessage: req.session.successMessage };
  req.session.errorMessage = null; // Clear the message after displaying it
  req.session.successMessage = null; // Clear the message after displaying it
  res.render('forgot-password', messages);
});


router.post('/auth/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.session.errorMessage = 'No account with that email address exists.';
      return res.redirect('/auth/forgot-password');
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetURL = `http://${req.headers.host}/auth/reset-password/${token}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${resetURL}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);
    req.session.successMessage = 'An email has been sent to ' + email + ' with further instructions.';
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Error during password reset request:', error);
    res.status(500).send('An error occurred during the password reset request.');
  }
});

router.get('/auth/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.session.errorMessage = 'Password reset token is invalid or has expired.';
      return res.redirect('/auth/forgot-password');
    }

    res.render('reset-password', { token: req.params.token });
  } catch (error) {
    console.error('Error finding user for password reset:', error);
    res.status(500).send('An error occurred during the password reset process.');
  }
});

router.post('/auth/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.session.errorMessage = 'Password reset token is invalid or has expired.';
      return res.redirect('/auth/forgot-password');
    }

    if (req.body.password !== req.body.confirmPassword) {
      req.session.errorMessage = 'Passwords do not match.';
      return res.redirect('back');
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    req.session.successMessage = 'Password has been reset. Please log in.';
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).send('An error occurred while resetting the password.');
  }
});

module.exports = router;