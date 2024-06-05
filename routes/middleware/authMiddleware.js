const User = require('../../models/User');

const isAuthenticated = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (!user) {
        console.error("User not found in database.");
        return res.redirect('/login'); // Redirect to login page
      }
      res.locals.themePreference = user.themePreference;
      console.log("User is authenticated, proceeding to the next middleware/route handler.");
      return next(); // User is authenticated, proceed to the next middleware or route handler
    } catch (err) {
      console.error("Error fetching user from database:", err.message, err.stack);
      return res.status(500).send('Internal server error');
    }
  } else {
    console.error("User is not authenticated. Redirecting to login.");
    return res.redirect('auth/login'); // Redirect to login page
  }
};

module.exports = { isAuthenticated };
