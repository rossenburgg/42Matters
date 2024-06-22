const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Item = require('../models/Item'); // Required for fetching items
const Announcement = require('../models/Announcement'); // Import the Announcement model
const DailyReward = require('../models/DailyReward');
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).exec();
    const items = await Item.find({}).exec(); // Fetching all items from the database
    const announcements = await Announcement.find({}).sort({ createdAt: -1 }).exec(); // Fetching all announcements from the database
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const rewardClaimed = await DailyReward.findOne({
      userId: req.session.userId,
      date: today
    }).exec();

    if (!user) {
      console.log("Redirecting to login, user not found.");
      res.redirect('/login');
    } else {
      console.log(`Displaying home page for user: ${user.username}`);
      // Check if the user is an admin
      const isAdmin = user.isAdmin || false; // Assuming isAdmin is a boolean
      if (isAdmin) {
        console.log("User is an admin.");
        console.log("Admin Username:", user.username);
      }

      res.render('home', {
        username: user.username,
        accountStatus: user.accountStatus,
        balance: user.balance,
        commission: user.commission,
        themePreference: user.themePreference,
        user: user, // Pass the entire user object to the view
        appBaseUrl: process.env.APP_BASE_URL, // Make appBaseUrl available to the view
        items: items, // Passing items to the view
        announcements: announcements, // Passing announcements to the view
        dailyRewardClaimed: !!rewardClaimed, // Pass a boolean indicating if the daily reward was claimed
        isAdmin: isAdmin // Pass the isAdmin boolean to the view
      });
    }
  } catch (error) {
    console.error(`Error fetching user, items, and announcements for home page: ${error.message}`);
    console.error(error.stack);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;