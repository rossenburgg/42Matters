const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now }
});

purchaseSchema.pre('save', function(next) {
  console.log(`Saving purchase for user ${this.userId} and item ${this.itemId}`);
  next();
});

purchaseSchema.post('save', function(doc, next) {
  console.log(`Purchase saved for user ${doc.userId} and item ${doc.itemId}`);
  next();
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;