document.addEventListener('DOMContentLoaded', function() {
    // Select the sidebar and the toggle button
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.navbar-toggler.d-lg-none');

    // Create an overlay for when the sidebar is active
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '998';
    overlay.style.display = 'none';
    document.body.appendChild(overlay);

    // Toggle the sidebar on button click
    sidebarToggle.addEventListener('click', function() {
        const isOpen = sidebar.classList.contains('active');
        if (isOpen) {
            sidebar.classList.remove('active');
            overlay.style.display = 'none';
        } else {
            sidebar.classList.add('active');
            overlay.style.display = 'block';
        }
    });

    // Hide the sidebar when the overlay is clicked
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.style.display = 'none';
    });

    // Automatically close the sidebar on window resize if the window width is greater than 768px
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
            overlay.style.display = 'none';
        }
    });

    console.log("Admin sidebar drawer functionality initialized.");
});