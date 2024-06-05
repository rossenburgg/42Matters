const mongoose = require('mongoose');

const dailyRewardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  received: { type: Boolean, default: false, required: true },
});

dailyRewardSchema.pre('save', function(next) {
  const reward = this;
  // Remove time component from date
  const currentDate = new Date();
  reward.date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  next();
});

const DailyReward = mongoose.model('DailyReward', dailyRewardSchema);

module.exports = DailyReward;