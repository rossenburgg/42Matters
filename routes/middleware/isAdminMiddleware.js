const User = require('../../models/User');

const isAdmin = async (req, res, next) => {
  try {
    if (!req.session.userId) {
      console.log('Access Denied: No user logged in.');
      return res.status(403).send('Access Denied: No user logged in.');
    }
    const user = await User.findById(req.session.userId);
    if (user && user.isAdmin) {
      console.log(`Access granted for admin user: ${user.username}`);
      next();
    } else {
      console.log('Access Denied: User is not an admin.');
      res.status(403).send('Access Denied');
    }
  } catch (error) {
    console.error('Error checking admin status:', error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = isAdmin;