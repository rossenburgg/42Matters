const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  termsAccepted: { type: Boolean, required: true },
  accountStatus: { type: String, default: 'Standard' },
  balance: { type: Number, default: 0 },
  commission: { type: Number, default: 0 },
  twoFactorSecret: { type: String },
  themePreference: { type: String, default: 'light' },
  referralCode: { type: String, unique: true, default: () => require('crypto').randomBytes(8).toString('hex') },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  rewards: { type: Number, default: 0 },
  isAdmin: { type: Boolean, default: false },
  tier: { type: String, enum: ['VIP1', 'VIP2', 'VIP3', 'VIP4'], default: 'VIP1' },
  loyaltyPoints: { type: Number, default: 0 }, // Added field for loyalty points
});

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      console.error(err.stack);
      return next(err);
    }
    user.password = hash;
    next();
  });

  // Normalize phone number
  user.phone = user.phone.replace(/[^0-9]/g, '');
});

// Method to update user's balance
userSchema.methods.updateBalance = async function(amount) {
  this.balance += amount;
  this.balance = parseFloat(this.balance.toFixed(2)); // Round to two decimal places
  try {
    await this.save();
    console.log(`Balance updated successfully for user: ${this.username}`);
  } catch (error) {
    console.error(`Error updating balance for user: ${this.username}`, error);
    throw error; // Rethrow the error to be handled by the caller
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;