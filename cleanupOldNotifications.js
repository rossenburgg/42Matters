const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const { ObjectId } = mongoose.Types;

require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error("DATABASE_URL is not set. Please check your .env file.");
  process.exit(1);
}

console.log('Connecting to database:', databaseUrl);

const cutoffDate = new Date();
cutoffDate.setDate(cutoffDate.getDate() - 1); // 24 hours ago

console.log('Cutoff date for deletion:', cutoffDate);

mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Database connected successfully');
    
    const oldNotifications = await Notification.find({ read: true, createdAt: { $lt: cutoffDate } });
    console.log('Old notifications found:', oldNotifications.length);
    oldNotifications.forEach(notification => {
      console.log(`Notification ID: ${notification._id}, Created At: ${notification.createdAt}`);
    });

    const result = await Notification.deleteMany({ read: true, createdAt: { $lt: cutoffDate } });
    console.log(`Deleted ${result.deletedCount} old notifications`);
    
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });
