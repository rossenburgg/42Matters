const User = require('../../models/User');

const themeMiddleware = async (req, res, next) => {
  if (req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user && user.themePreference) {
        res.locals.themePreference = user.themePreference;
        console.log(`Theme preference set to ${user.themePreference} for user ${req.session.userId}`);
      } else {
        res.locals.themePreference = 'light'; // Default theme if not set or user not found
        console.log(`User not found or no theme preference set. Setting default theme preference to 'light' for session ${req.session.userId}`);
      }
    } catch (error) {
      console.error("Error fetching user's theme preference:", error.message, error.stack);
      res.locals.themePreference = 'light'; // Fallback theme
      console.error(`Failed to fetch theme preference for user ${req.session.userId}. Defaulting to 'light'.`);
    }
  } else {
    res.locals.themePreference = 'light'; // Non-authenticated users get the default theme
    console.log("No user session found. Setting theme preference to 'light'.");
  }
  next();
};

module.exports = themeMiddleware;