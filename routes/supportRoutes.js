const express = require('express');
const router = express.Router();
const isAuthenticated = require('./middleware/authMiddleware').isAuthenticated;
const SupportRequest = require('../models/SupportRequest');
const User = require('../models/User');

// Route to render the support page
router.get('/support', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findById(userId);
  res.render('support',  {username: user.username});
  // console.log(user.username );
});

// Route to handle support request submission
router.post('/submit-support', isAuthenticated, async (req, res) => {
  try {
    const { message } = req.body;
    const supportRequest = new SupportRequest({
      userId: req.session.userId,
      message: message,
      createdAt: new Date()
    });
    await supportRequest.save();
    res.status(200).json({ message: 'Support request submitted successfully' }); // Changed to send JSON response for Toastr notification
  } catch (error) {
    console.error(`Error submitting support request: ${error.message}`, error.stack);
    res.status(500).json({ error: 'Error submitting support request' }); // Changed to send JSON response for Toastr error handling
  }
});

module.exports = router;