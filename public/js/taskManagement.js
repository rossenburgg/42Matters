document.addEventListener('DOMContentLoaded', () => {
  window.startTask = async (taskId) => {
    try {
      const response = await fetch('/tasks/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });
      if (!response.ok) {
        throw new Error('Failed to start task. Server responded with ' + response.status);
      }
      console.log('Task started successfully');
      toastrNotifications.showToastrNotification('success', 'Task started successfully', 'Success');
      location.reload(); // Reload to reflect the updated status
    } catch (err) {
      console.error('Error starting task:', err);
      toastrNotifications.showToastrNotification('error', 'Error starting task. Please check the console for more details.', 'Error');
    }
  };

  window.submitTask = async (taskId) => {
    try {
      const response = await fetch('/tasks/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskId }),
      });
      if (!response.ok) {
        throw new Error('Failed to submit task. Server responded with ' + response.status);
      }
      console.log('Task submitted successfully');
      toastrNotifications.showToastrNotification('success', 'Task submitted successfully', 'Success');
      location.reload(); // Reload to reflect the updated status
    } catch (err) {
      console.error('Error submitting task:', err);
      toastrNotifications.showToastrNotification('error', 'Error submitting task. Please check the console for more details.', 'Error');
    }
  };
});