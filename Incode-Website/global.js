document.addEventListener('DOMContentLoaded', () => {
    // Get current page path
    let currentPath = window.location.pathname;
    
    // Normalize: remove trailing slash, get last segment
    currentPath = currentPath.replace(/\/$/, '').split('/').pop() || 'index.html';
    
    // If empty (root), default to index
    if (!currentPath) currentPath = 'index.html';
    
    document.querySelectorAll('nav a').forEach(link => {
        // Get href and normalize it too
        let linkHref = link.getAttribute('href');
        if (!linkHref) return;
        
        // Remove leading ./ if present
        linkHref = linkHref.replace(/^\.\//, '');
        
        // Remove any folder paths from href for comparison
        const linkFile = linkHref.split('/').pop();
        
        // Check match
        const isMatch = 
            linkFile === currentPath || 
            linkFile === currentPath.replace('.html', '') ||
            (currentPath === '' && linkFile === 'index.html');
        
        if (isMatch) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});
// ===== THEME TOGGLE =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Check for saved preference or system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Apply initial theme
if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
} else if (systemPrefersDark) {
    html.setAttribute('data-theme', 'dark');
} else {
    html.setAttribute('data-theme', 'light');
}

// Toggle function
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add a subtle rotation animation on click
    themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 300);
});

// ===== MOBILE MENU =====
document.querySelector('.menu-toggle').addEventListener('click', function() {
    this.classList.toggle('active');
    document.querySelector('.nav-links').classList.toggle('mobile-open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.menu-toggle').classList.remove('active');
        document.querySelector('.nav-links').classList.remove('mobile-open');
    });
});

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    const nav = document.querySelector('.nav-links');
    const toggle = document.querySelector('.menu-toggle');
    if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('mobile-open')) {
        toggle.classList.remove('active');
        nav.classList.remove('mobile-open');
    }  
});