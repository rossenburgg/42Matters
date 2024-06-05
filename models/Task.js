const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  amountEarned: { type: Number, required: true },
  commission: { type: Number, required: true },
  rating: { type: Number, required: true },
  creationDate: { type: Date, default: Date.now },
  uniqueCode: { type: String, required: true },
  status: { type: String, default: 'Pending' }, // Status can be Pending, In Progress, or Completed
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;