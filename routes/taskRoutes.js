const express = require('express');
const Task = require('../models/Task');
const { isAuthenticated } = require('./middleware/authMiddleware');
const User = require('../models/User');

const router = express.Router();

// Fetch tasks for the logged-in user
router.get('/tasks', isAuthenticated, async (req, res) => {
  const userId = req.session.userId;
  const user = await User.findById(userId)
  const username = user.username;


  try {
    // Temporarily fetch all tasks for debugging purposes
    const tasks = await Task.find({});
    console.log('Fetched tasks:', tasks);
    res.render('tasks', { username: username, tasks });
  } catch (err) {
    console.error('Error fetching tasks:', err.message);
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Update task status (start/manage)
router.post('/tasks/start', isAuthenticated, async (req, res) => {
  try {
    const { taskId } = req.body;
    await Task.findByIdAndUpdate(taskId, { status: 'In Progress' });
    console.log(`Task ${taskId} started`);
    res.json({ message: 'Task started' });
  } catch (err) {
    console.error('Error starting task:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Submit a task
router.post('/tasks/submit', isAuthenticated, async (req, res) => {
  try {
    const { taskId } = req.body;
    await Task.findByIdAndUpdate(taskId, { status: 'Completed' });
    console.log(`Task ${taskId} submitted`);
    res.json({ message: 'Task submitted' });
  } catch (err) {
    console.error('Error submitting task:', err.message);
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;