document.addEventListener('DOMContentLoaded', () => {
  // Connecting to WebSocket
  const socket = io();

  // Retrieve user ID from a hidden HTML element or another source
  const userId = document.body.dataset.userId; // Assuming the user ID is stored in a data attribute on the <body> tag

  if (userId) {
    // Register the user with their ID for personalized notifications
    socket.emit('register', userId);

    // Listen for notification count updates
    socket.on('notification count', (count) => {
      const notificationIcon = document.querySelector('#notificationIcon'); // Assuming there's an element with ID 'notificationIcon' for showing notification count
      if (notificationIcon) {
        notificationIcon.innerText = count; // Update the notification count displayed on the icon
      }
    });
  }

  // Listening for task progress updates
  socket.on('taskProgress', (data) => {
    toastr.info(`Task ${data.taskId} is now ${data.status}.`, 'Task Progress');
    console.log(`Task ${data.taskId} status updated to ${data.status}.`);
    // Optionally, update task status on the page...
  });

  // Error handling for WebSocket connection
  socket.on('connect_error', (err) => {
    console.error('WebSocket connection error: ', err.message);
    toastr.error('Unable to establish connection. Please check your internet connection and try again.', 'Connection Error');
    console.log('Attempting to reconnect to WebSocket...');
    setTimeout(() => {
      socket.connect();
    }, 1000); // Attempt to reconnect after 1 second
  });

  // Attempt to re-establish connection upon disconnection
  socket.on('disconnect', () => {
    console.warn('WebSocket disconnected. Attempting to reconnect...');
    toastr.warning('Connection lost. Reconnecting...', 'Disconnected');
    setTimeout(() => {
      socket.connect();
    }, 1000); // Attempt to reconnect after 1 second
  });


  // Form validation for registration
  const registrationForm = document.querySelector('#registrationForm');
  if (registrationForm) {
    registrationForm.addEventListener('submit', (e) => {
      const password = document.querySelector('#password').value;
      const confirmPassword = document.querySelector('#confirmPassword').value;
      const termsAccepted = document.querySelector('#termsAccepted').checked;

      if (password !== confirmPassword) {
        e.preventDefault(); // Prevent form submission
        toastr.error('Passwords do not match.', 'Registration Error');
        console.error('Form submission error: Passwords do not match.');
      }

      if (!termsAccepted) {
        e.preventDefault(); // Prevent form submission
        toastr.error('You must accept the terms and conditions.', 'Registration Error');
        console.error('Form submission error: Terms and conditions not accepted.');
      }
    });
  }

  // Notification dropdown toggle
  document.addEventListener('click', function(event) {
    const isDropdownButton = event.target.matches('#notificationIcon') || event.target.closest('#notificationIcon') !== null;
    const dropdownMenu = document.querySelector('#notificationDropdown .dropdown-menu');
    if (isDropdownButton) {
      dropdownMenu.classList.toggle('show');
    } else if (dropdownMenu.classList.contains('show')) {
      dropdownMenu.classList.remove('show');
    }
  });
});

// Toastr configuration
toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: 'toast-top-right',
  preventDuplicates: true,
  showDuration: '400',
  hideDuration: '1000',
  timeOut: '7000',
  extendedTimeOut: '1000',
  showEasing: 'swing',
  hideEasing: 'linear',
  showMethod: 'fadeIn',
  hideMethod: 'fadeOut'
};