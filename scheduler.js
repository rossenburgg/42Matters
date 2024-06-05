// scheduler.js
const cron = require('node-cron');
const { exec } = require('child_process');
require('dotenv').config();

cron.schedule('0 0 * * *', () => { // Run every day at midnight
  console.log('Running scheduled task: cleanup old notifications');
  exec('node cleanupOldNotifications.js', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing cleanup script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Error in cleanup script: ${stderr}`);
      return;
    }
    console.log(`Cleanup script output: ${stdout}`);
  });
});
