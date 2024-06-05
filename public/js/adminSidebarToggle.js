document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.querySelector('#sidebarToggle');
    const sidebar = document.querySelector('.sidebar'); // Changed from ID to class to match the existing HTML structure.

    if (!sidebarToggle || !sidebar) {
        console.error('Sidebar or toggle button not found');
        return;
    }

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        // Added logic to handle the visibility of the overlay for mobile devices.
        const overlay = document.querySelector('.sidebar-overlay');
        if (!overlay) {
            console.error('Overlay not found');
            return;
        }
        if (sidebar.classList.contains('active')) {
            overlay.style.display = 'block';
        } else {
            overlay.style.display = 'none';
        }
    });

    // Added event listener for overlay clicks to close the sidebar on mobile.
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            this.style.display = 'none';
        });
    } else {
        console.error('Overlay not found for event binding');
    }

    // Correctly handle clicks on sidebar links to ensure navigation
    sidebar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default to handle navigation manually.
            window.location.href = this.href;
            // Added log for navigation action.
            console.log(`Navigating to ${this.href}`);
        });
    });

    // Added error handling for navigation errors.
    window.addEventListener('error', (error) => {
        console.error('Navigation error:', error.message);
        console.error(error.stack);
    });
});