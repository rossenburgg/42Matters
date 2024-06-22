// routes/startingRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item'); // Ensure the Item model includes the taskCode field
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/starting', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).exec();
    const items = await Item.find({}).exec(); // Fetching all items from the database

    if (!user) {
      console.log("Redirecting to login, user not found.");
      res.redirect('/auth/login');
    } else {
      console.log(`Displaying starting page for user: ${user.username}`);
      res.render('starting', {
        user: user,
        username: user.username,
        walletBalance: user.balance,
        commission: user.commission,
        items: items, // Passing items to the view
        themePreference: req.session.themePreference || 'light'
      });
    }
  } catch (error) {
    console.error(`Error fetching user for starting page: ${error.message}`);
    console.error(error.stack);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
