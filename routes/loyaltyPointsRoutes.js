const express = require('express');
const { isAuthenticated } = require('./middleware/authMiddleware');
const { addLoyaltyPoints, redeemLoyaltyPoints } = require('../services/loyaltyPointsService');

const router = express.Router();

router.post('/add-points', isAuthenticated, async (req, res) => {
  try {
    const { userId, points } = req.body;
    const updatedUser = await addLoyaltyPoints(userId, points);
    console.log(`Loyalty points added: ${points} to user: ${userId}`);
    res.json({ success: true, loyaltyPoints: updatedUser.loyaltyPoints });
  } catch (error) {
    console.error('Error adding loyalty points:', error.message);
    console.error(error.stack);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/redeem-points', isAuthenticated, async (req, res) => {
  try {
    const { userId, points } = req.body;
    const user = await redeemLoyaltyPoints(userId, points);
    if (!user) {
      return res.status(400).json({ success: false, message: "User not found or insufficient loyalty points." });
    }
    console.log(`Loyalty points redeemed: ${points} by user: ${userId}`);
    res.json({ success: true, loyaltyPoints: user.loyaltyPoints });
  } catch (error) {
    console.error('Error redeeming loyalty points:', error.message);
    console.error(error.stack);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;