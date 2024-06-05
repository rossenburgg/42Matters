const mongoose = require('mongoose');

const SupportRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

SupportRequestSchema.pre('save', function(next) {
  console.log(`Saving support request from user ${this.userId} at ${new Date().toISOString()}`);
  next();
});

const SupportRequest = mongoose.model('SupportRequest', SupportRequestSchema);

module.exports = SupportRequest;