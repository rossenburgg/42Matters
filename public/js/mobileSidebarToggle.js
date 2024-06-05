document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.querySelector('#sidebarToggle');
    const sidebar = document.querySelector('.sidebar');

    if (!sidebarToggle || !sidebar) {
        console.error('Sidebar or toggle button not found in the document.');
        return;
    }

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        // Log sidebar toggle action
        console.log('Sidebar toggle clicked. Sidebar visibility changed.');
    });

    // Initially hide the full link texts on mobile by adding 'active' class
    // This ensures that only icons are visible on mobile devices by default
    try {
        if (window.innerWidth <= 768) { // Assuming 768px as a breakpoint for mobile devices
            sidebar.classList.add('active');
        }
    } catch (error) {
        console.error('Error while initializing sidebar for mobile devices:', error.message);
        console.error(error.stack);
    }
});