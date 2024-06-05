const User = require('../models/User');

// Function to set the user's theme preference to light
exports.setLightTheme = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.session.userId, { themePreference: 'light' });
    console.log(`Theme updated to light for user ${req.session.userId}`);
    res.redirect('back'); // Redirect back to the previous page
  } catch (error) {
    console.error("Error updating theme to light:", error.message, error.stack);
    res.status(500).send("Failed to set light theme.");
  }
};

// Function to set the user's theme preference to dark
exports.setDarkTheme = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.session.userId, { themePreference: 'dark' });
    console.log(`Theme updated to dark for user ${req.session.userId}`);
    res.redirect('back'); // Redirect back to the previous page
  } catch (error) {
    console.error("Error updating theme to dark:", error.message, error.stack);
    res.status(500).send("Failed to set dark theme.");
  }
};