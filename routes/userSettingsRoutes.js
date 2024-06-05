const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('./middleware/authMiddleware');

// Route to update theme preference
router.post('/update-theme', isAuthenticated, async (req, res) => {
  const { theme } = req.body;
  try {
    await User.findByIdAndUpdate(req.session.userId, { themePreference: theme });
    console.log(`Theme updated to ${theme} for user ${req.session.userId}`);
    res.status(200).send("Theme updated successfully.");
  } catch (error) {
    console.error("Error updating theme preference:", error.message, error.stack);
    res.status(500).send("Failed to update theme.");
  }
});

module.exports = router;