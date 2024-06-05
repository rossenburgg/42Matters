const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

announcementSchema.plugin(uniqueValidator);

announcementSchema.post('save', function(error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'));
  } else {
    next(error);
  }
});

announcementSchema.post('save', function(doc, next) {
  console.log(`New announcement "${doc.title}" created at ${doc.createdAt}`);
  next();
});

module.exports = mongoose.model('Announcement', announcementSchema);