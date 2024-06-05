const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/wallet-info', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId).exec();
    if (!user) {
      console.log("User not found for wallet info.");
      return res.status(404).json({ message: "User not found." });
    } else {
      console.log(`Retrieving wallet info for user: ${user.username}`);
      res.json({
        balance: user.balance,
        commission: user.commission,
      });
    }
  } catch (error) {
    console.error(`Error fetching wallet info: ${error.message}`);
    console.error(error.stack);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;