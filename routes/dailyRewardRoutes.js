const express = require('express');
const router = express.Router();
const DailyReward = require('../models/DailyReward');
const User = require('../models/User');
const { isAuthenticated } = require('./middleware/authMiddleware');

const DAILY_REWARD_AMOUNT = 0.2; // Fixed daily reward amount

router.post('/api/claim-daily-reward', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rewardClaimed = await DailyReward.findOne({
      userId,
      date: today
    });

    if (rewardClaimed) {
      console.log(`User ${userId} has already claimed the daily reward.`);
      return res.status(400).json({ message: 'Reward already claimed today.' });
    }

    // Claim the daily reward
    const newReward = new DailyReward({
      userId,
      date: today,
      received: true
    });
    await newReward.save();

    // Update the user's balance
    const user = await User.findById(userId);
    await user.updateBalance(DAILY_REWARD_AMOUNT);

    console.log(`User ${userId} claimed daily reward successfully.`);
    res.status(200).json({ message: 'Daily reward claimed successfully!', newBalance: user.balance });
  } catch (error) {
    console.error('Error claiming daily reward:', error.message, error.stack);
    res.status(500).json({ message: 'An error occurred while claiming the daily reward.' });
  }
});

// Route to check and send daily reward notification
router.get('/check', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const reward = await DailyReward.findOne({ userId, date: today });

    if (!reward) {
      // Send daily reward notification
      await Notification.createNotification(userId, 'Your daily reward is ready to be claimed!');

      res.json({ available: true });
    } else {
      res.json({ available: false });
    }
  } catch (error) {
    console.error('Error checking daily reward:', error);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;