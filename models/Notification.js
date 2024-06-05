const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

notificationSchema.statics.createNotification = async function(userId, message) {
  try {
    const notification = await this.create({ userId, message });
    console.log("Notification created successfully:", notification);
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error.message);
    throw error;
  }
};

notificationSchema.statics.markAsRead = async function(notificationId) {
  try {
    const notification = await this.findByIdAndUpdate(notificationId, { read: true }, { new: true });
    console.log("Notification marked as read:", notification);
    return notification;
  } catch (error) {
    console.error("Error marking notification as read:", error.message);
    throw error;
  }
};

notificationSchema.statics.deleteNotification = async function(notificationId) {
  try {
    const result = await this.findByIdAndDelete(notificationId);
    console.log("Notification deleted successfully:", result);
    return result;
  } catch (error) {
    console.error("Error deleting notification:", error.message);
    throw error;
  }
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
