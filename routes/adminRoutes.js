const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Item = require('../models/Item');
const User = require('../models/User');
const Task = require('../models/Task'); // Ensure Task model is imported
const Announcement = require('../models/Announcement'); // Import the Announcement model
const { isAuthenticated } = require('./middleware/authMiddleware');
const isAdminMiddleware = require('./middleware/isAdminMiddleware');

// Admin Dashboard Route
router.get('/admin/dashboard', [isAuthenticated, isAdminMiddleware], (req, res) => {
    res.render('admin/dashboard');
});

// Admin Users Management Route
router.get('/admin/users', [isAuthenticated, isAdminMiddleware], async (req, res) => {
  try {
    const users = await User.find({});
    res.render('admin/users', { users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Admin Purchases Management Route
router.get('/admin/purchases', [isAuthenticated, isAdminMiddleware], async (req, res) => {
  try {
    const pendingPurchases = await Purchase.find({ status: 'pending' })
      .populate('userId', 'username') // Ensure to populate the username of the user
      .populate('itemId', 'name price') // Ensure to populate the name and price of the item
      .exec();
    res.render('admin/purchases', { pendingPurchases });
  } catch (error) {
    console.error('Error fetching pending purchases:', error);
    res.status(500).send('Internal Server Error');
  }
});


// Admin Announcements Route
router.get('/admin/announcements', [isAuthenticated, isAdminMiddleware], (req, res) => {
  res.render('admin/announcements');
});

router.get('/admin', [isAuthenticated, isAdminMiddleware], (req, res) => {
  res.render('admin/home');
});

// Route to handle posting of announcements
router.post('/admin/announcements', [isAuthenticated, isAdminMiddleware], async (req, res) => {
  try {
    const { title, content } = req.body;
    const announcement = new Announcement({ title, content });
    await announcement.save();
    console.log('Announcement created successfully');
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Admin Tasks Management Route
router.get('/admin/tasks', [isAuthenticated, isAdminMiddleware], async (req, res) => {
  try {
    const tasks = await Task.find({}).populate('userId').exec();
    res.render('admin/tasks', { tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Admin Reports Route
router.get('/admin/reports', [isAuthenticated, isAdminMiddleware], (req, res) => {
  res.render('admin/reports');
});

// Route to confirm a purchase
router.post('/admin/purchase/:id/confirm', [isAuthenticated, isAdminMiddleware], async (req, res) => {
  try {
    console.log('Confirm purchase route hit');
    const purchaseId = req.params.id;
    const purchase = await Purchase.findById(purchaseId).populate('itemId').populate('userId');
    if (!purchase) {
      console.error('Purchase not found');
      return res.status(404).json({ success: false, message: 'Purchase not found.' });
    }
    const commission = purchase.itemId.commission;
    const userId = purchase.userId._id;
    await User.findByIdAndUpdate(userId, { $inc: { balance: commission } });
    await Purchase.findByIdAndUpdate(purchaseId, { status: 'confirmed' });
    console.log(`Purchase ${purchaseId} confirmed and commission added to user ${userId}`);
    res.json({ success: true, message: 'Purchase confirmed successfully and commission added.' });
  } catch (error) {
    console.error('Error confirming purchase and adding commission:', error);
    res.status(500).json({ success: false, message: 'Error confirming purchase and adding commission.', error: error.message });
  }
});

// Route to reject a purchase
router.post('/admin/purchase/:id/reject', [isAuthenticated, isAdminMiddleware], async (req, res) => {
  try {
    console.log('Reject purchase route hit');
    const purchaseId = req.params.id;
    await Purchase.findByIdAndUpdate(purchaseId, { status: 'rejected' });
    console.log(`Purchase ${purchaseId} rejected`);
    res.json({ success: true, message: 'Purchase rejected successfully.' });
  } catch (error) {
    console.error('Error rejecting purchase:', error);
    res.status(500).json({ success: false, message: 'Error rejecting purchase.', error: error.message });
  }
});


// Placeholder for edit user route
router.get('/admin/users/edit/:id', [isAuthenticated, isAdminMiddleware], async (req, res) => {
  // Fetch user by id and render edit form
  console.log(`Fetching user ${req.params.id} for edit`);
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.log('User not found');
      return res.status(404).send('User not found');
    }
    res.render('admin/editUser', { user });
  } catch (error) {
    console.error('Error fetching user for edit:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Route for deleting a user
router.delete('/admin/users/delete/:id', [isAuthenticated, isAdminMiddleware], async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    console.log(`User ${req.params.id} deleted successfully`);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false });
  }
});

// Route to add a new task
router.post('/admin/tasks/add', [isAuthenticated, isAdminMiddleware], async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        console.log('New task added successfully');
        res.json({ message: 'Task added successfully.' });
    } catch (error) {
        console.error('Error adding new task:', error);
        res.status(500).json({ message: 'Failed to add task.', error: error.message });
    }
});

module.exports = router;