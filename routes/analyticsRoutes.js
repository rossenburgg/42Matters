const express = require('express');
const Task = require('../models/Task');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const router = express.Router();
const User = require('../models/User');

// Serve the analytics dashboard page
router.get('/analytics', async (req, res) => {
  try {
    const user = req.user; // Assuming user is available in the request object
    const tasks = await Task.find({}); // Adjust the query as needed to fetch relevant 
    const detailedUser = await User.findById(req.session.userId).exec();

    const isAdmin = detailedUser.isAdmin; // Check if isAdmin property exists in user object

    console.log('Analytics data fetched successfully.');
    res.render('analytics', { username: user, tasks, isAdmin: isAdmin });
  } catch (err) {
    console.error('Error fetching analytics data:', err.message);
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  }
});

// Endpoint to download transactions and earnings report as CSV
router.get('/analytics/download-report', async (req, res) => {
  const csvWriter = createCsvWriter({
    path: 'temp-report.csv', // Temporarily write to a file, which will be streamed to the client
    header: [
      {id: 'description', title: 'DESCRIPTION'},
      {id: 'amountEarned', title: 'AMOUNT EARNED'},
      {id: 'commission', title: 'COMMISSION'},
      // Add more fields as necessary
    ]
  });

  try {
    const tasks = await Task.find({}); // Adjust the query as needed to fetch relevant data
    await csvWriter.writeRecords(tasks); // Write the records to the CSV
    res.download('temp-report.csv', `report-${Date.now()}.csv`, (err) => {
      if (err) {
        console.error('Error sending report file:', err.message);
        console.error(err.stack);
        res.status(500).send('Internal Server Error');
      }
      // Optionally delete the temp file here if needed
    });
    console.log('Report generated and sent successfully.');
  } catch (err) {
    console.error('Error generating report:', err.message);
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/api/analytics/data', async (req, res) => {
  try {
    const tasks = await Task.find({});
    const labels = tasks.map(task => task.creationDate.toISOString().split('T')[0]);
    const earnings = tasks.map(task => task.amountEarned);

    console.log('Analytics data fetched successfully.');
    res.json({
      labels,
      earnings,
      tasks // Include tasks details for the performance metrics table
    });
  } catch (err) {
    console.error('Error fetching analytics data:', err.message);
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
