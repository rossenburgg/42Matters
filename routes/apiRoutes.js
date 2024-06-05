const express = require('express');
const Task = require('../models/Task');
const Item = require('../models/Item'); // Importing the Item model
const User = require('../models/User');
const Purchase = require('../models/Purchase'); // Importing the Purchase model
const { isAuthenticated } = require('./middleware/authMiddleware');
const { fetchUnreadNotificationsPaginated } = require('../services/notificationService');
const Notification = require('../models/Notification'); // Importing the Notification model
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId; // Correctly use ObjectId from mongoose.Types


// Serve analytics data for the dashboard
router.get('/analytics/data', async (req, res) => {
  try {
    // Assuming req.session.userId is set after successful authentication
    if (!req.session || !req.session.userId) {
      console.log('User not authenticated');
      return res.status(403).json({ message: 'User not authenticated' });
    }

    const tasks = await Task.find({ userId: req.session.userId }).lean();
    const labels = tasks.map(task => task.creationDate.toISOString().split('T')[0]);
    const earnings = tasks.map(task => task.amountEarned);

    console.log('Analytics data fetched successfully for user:', req.session.userId);

    res.json({
      labels,
      earnings,
      tasks // Include tasks details for the performance metrics table
    });
  } catch (err) {
    console.error('Error fetching analytics data:', err);
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch item details by ID
router.get('/item/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    if (!item) {
      console.log(`Item with ID ${itemId} not found`);
      return res.status(404).json({ message: 'Item not found' });
    }
    console.log(`Item details fetched successfully for item ID: ${itemId}`);
    res.json(item);
  } catch (err) {
    console.error(`Error fetching item details for item ID ${req.params.id}:`, err);
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/items', isAuthenticated, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};

    const items = await Item.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    const totalItems = await Item.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    res.json({ items, totalPages, currentPage: parseInt(page) });
  } catch (err) {
    console.error('Error fetching items:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Purchase item
router.post('/purchase/:id', isAuthenticated, async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Item.findById(itemId);
    if (!item) {
      console.log(`Item with ID ${itemId} not found`);
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const user = await User.findById(req.session.userId);
    if (user.balance < item.price) {
      console.log('Insufficient balance for purchase');
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Deduct item price from user's balance
    user.balance -= item.price;

    // Create a new purchase record
    const purchase = new Purchase({
      userId: req.session.userId,
      itemId: itemId,
      status: 'pending'
    });

    // Attempt to save user balance, purchase record atomically
    try {
      await user.save();
      await purchase.save();
      console.log(`Purchase record created for user ${req.session.userId} and item ${itemId}`);
      res.json({ success: true, message: 'Purchase successful, awaiting admin confirmation', newBalance: user.balance });
    } catch (err) {
      console.error('Error updating user balance or creating purchase record:', err);
      console.error(err.stack);
      res.status(500).json({ success: false, message: 'Error processing purchase' });
    }
  } catch (error) {
    console.error('Error processing purchase:', error);
    console.error(error.stack);
    res.status(500).json({ success: false, message: 'Error processing purchase' });
  }
});


// Route for fetching unread notifications with pagination
router.get('/notifications/unread', isAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const { notifications, total, pages, currentPage } = await fetchUnreadNotificationsPaginated(req.session.userId, page, limit);

    res.json({
      success: true,
      data: notifications,
      meta: {
        total,
        pages,
        currentPage
      }
    });
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    console.error(error.stack);
    res.status(500).json({ success: false, message: "Failed to fetch unread notifications" });
  }
});



// Fetch notifications
router.get('/notifications', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log('Fetching notifications for user:', userId);

    // Query userId as a string
    const notifications = await Notification.find({ userId: userId }).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const totalNotifications = await Notification.countDocuments({ userId: userId });
    const totalPages = Math.ceil(totalNotifications / limit);

    // Mark notifications as read
    await Notification.updateMany({ userId: userId, read: false }, { $set: { read: true } });

    console.log('Notifications found:', notifications.length, notifications);

    res.status(200).json({
      success: true,
      notifications: notifications,
      pageInfo: {
        currentPage: page,
        totalPages,
        totalNotifications,
      },
    });
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
  }
});


// Mark notifications as read
router.post('/notifications/markAsRead', isAuthenticated, async (req, res) => {
  try {
    const { notificationIds } = req.body;

    await Notification.updateMany(
      { _id: { $in: notificationIds }, userId: req.session.userId },
      { $set: { read: true } }
    );

    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({ success: false, message: 'Error marking notifications as read' });
  }
});




module.exports = router;