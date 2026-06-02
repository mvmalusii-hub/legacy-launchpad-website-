// Mobile menu toggle for top navigation
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.getElementById('menuToggle');
    const topNav = document.getElementById('topNav');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            topNav.classList.toggle('show');
        });
    }

    // Sidebar toggle (if you have a separate hamburger button for sidebar, you can add it)
    // For now, we rely on the top-nav toggle only.
    // If you want a sidebar toggle button, add:
    // const sidebarBtn = document.getElementById('sidebarToggle');
    // const sidebar = document.getElementById('sidebar');
    // sidebarBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
});