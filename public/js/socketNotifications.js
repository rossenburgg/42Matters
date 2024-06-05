document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    // Assuming the user's ID is stored in a meta tag for simplicity
    const userId = document.querySelector('meta[name="user-id"]').content;

    // Register with the server for this user's notifications
    socket.emit('register', userId);

    // Listen for real-time notification count updates
    socket.on('notification count', (count) => {
        const notificationCountElement = document.getElementById('notificationCount');
        if (notificationCountElement) {
            notificationCountElement.innerText = count;
            console.log(`Notification count updated to ${count} for user ${userId}.`);
        } else {
            console.error('Notification count element not found.');
        }
    });

    // Handle click event for the notification icon
    const notificationIcon = document.getElementById('notificationIcon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', () => {
            const notificationDropdown = document.getElementById('notificationDropdown');
            if (notificationDropdown) {
                notificationDropdown.classList.toggle('show');
                // Fetch notifications on click and populate the dropdown
                fetch('/api/notifications')
                    .then(response => response.json())
                    .then(data => {
                        const notificationDropdownMenu = document.getElementById('notificationDropdownMenu');
                        if (notificationDropdownMenu) {
                            notificationDropdownMenu.innerHTML = ''; // Clear existing notifications
                            data.notifications.forEach(notification => {
                                const newNotificationElement = document.createElement('a');
                                newNotificationElement.href = '#';
                                newNotificationElement.classList.add('dropdown-item');
                                newNotificationElement.innerText = notification.message;
                                notificationDropdownMenu.prepend(newNotificationElement);
                            });
                            console.log('Notifications fetched and added to the dropdown menu.');
                        } else {
                            console.error('Notification dropdown menu element not found.');
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching notifications:', error);
                    });
                console.log('Toggled notification dropdown visibility.');
            } else {
                console.error('Notification dropdown element not found.');
            }
        });
    } else {
        console.error('Notification icon element not found.');
    }

    // Close the dropdown when clicking outside of it
    window.addEventListener('click', function(event) {
        const notificationDropdown = document.getElementById('notificationDropdown');
        if (notificationDropdown && !notificationDropdown.contains(event.target) && !notificationIcon.contains(event.target)) {
            notificationDropdown.classList.remove('show');
            console.log('Clicked outside the notification dropdown, hiding it.');
        }
    });

    // Listen for real-time notifications and display them in the dropdown menu
    socket.on('new notification', (notification) => {
        const notificationDropdownMenu = document.getElementById('notificationDropdownMenu');
        if (notificationDropdownMenu) {
            const newNotificationElement = document.createElement('a');
            newNotificationElement.href = '#';
            newNotificationElement.classList.add('dropdown-item');
            newNotificationElement.innerText = notification.message;
            notificationDropdownMenu.prepend(newNotificationElement);
            console.log('Added new notification to the dropdown menu.');
        } else {
            console.error('Notification dropdown menu element not found.');
        }
    });

    // Emit a request for the initial notification count on page load
    if (userId) {
        socket.emit('initial-notification-count', userId);
    }

    // Handle other socket events or client-side logic here
});