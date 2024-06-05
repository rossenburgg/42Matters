const User = require('../models/User');

const addLoyaltyPoints = async (userId, points) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { loyaltyPoints: points } }, { new: true });
    console.log(`Loyalty points added: ${points} to user: ${userId}`);
    return updatedUser;
  } catch (error) {
    console.error('Error adding loyalty points:', error.message);
    console.error(error.stack);
    throw error;
  }
};

const redeemLoyaltyPoints = async (userId, points) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    if (user.loyaltyPoints < points) throw new Error('Not enough loyalty points');
    const updatedUser = await User.findByIdAndUpdate(userId, { $inc: { loyaltyPoints: -points } }, { new: true });
    console.log(`Loyalty points redeemed: ${points} by user: ${userId}`);
    return updatedUser;
  } catch (error) {
    console.error('Error redeeming loyalty points:', error.message);
    console.error(error.stack);
    throw error;
  }
};

module.exports = { addLoyaltyPoints, redeemLoyaltyPoints };