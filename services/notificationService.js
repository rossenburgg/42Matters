const Notification = require('../models/Notification');
const socketManager = require('./socketManager'); // Corrected import path

const createNotification = async (userId, message) => {
  try {
    const notification = new Notification({
      userId,
      message,
      read: false, // Default to false when creating a new notification
      createdAt: new Date(),
    });
    await notification.save();
    console.log("Notification created successfully for user:", userId);

    // Check if socketManager has the emitNotificationToUser function
    if (socketManager.emitNotificationToUser) {
      // Emit notification to the specific user using the socket manager module
      socketManager.emitNotificationToUser(userId, { message: notification.message, createdAt: notification.createdAt });
    } else {
      console.error("emitNotificationToUser function not found in socketManager");
    }

    return notification;
  } catch (error) {
    console.error("Failed to create notification for user:", userId, error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

const fetchUnreadNotifications = async (userId) => {
  try {
    const notifications = await Notification.find({ userId, read: false }).sort({ createdAt: -1 });
    console.log(`Fetched ${notifications.length} unread notifications for user:`, userId);
    return notifications;
  } catch (error) {
    console.error("Failed to fetch unread notifications for user:", userId, error);
    throw error;
  }
};

const fetchUnreadNotificationsPaginated = async (userId, page = 1, limit = 10) => {
  try {
    const notifications = await Notification.find({ userId, read: false })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Notification.find({ userId, read: false }).countDocuments();
    const pages = Math.ceil(total / limit);

    console.log(`Fetched paginated unread notifications for user:`, userId);
    return { notifications, total, pages, currentPage: page };
  } catch (error) {
    console.error("Failed to fetch paginated unread notifications for user:", userId, error);
    throw error;
  }
};

module.exports = {
  createNotification,
  fetchUnreadNotifications,
  fetchUnreadNotificationsPaginated,
};