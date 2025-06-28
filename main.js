// script.js

// --- 1.1. Theme Toggle Functionality ---
// Get references to the theme toggle button and the body
const themeToggleButton = document.querySelector('.theme-toggle');
const body = document.body;

// Function to set the theme
function setTheme(theme) {
    // Remove both light-mode and dark-mode classes first to ensure clean switch
    body.classList.remove('light-mode', 'dark-mode');
    // Add the desired theme class
    body.classList.add(theme);
    // Store the chosen theme in localStorage so it persists across sessions
    localStorage.setItem('theme', theme);
}

// Function to toggle the theme
function toggleTheme() {
    // Check the current theme based on body class
    if (body.classList.contains('dark-mode')) {
        setTheme('light-mode');
    } else {
        setTheme('dark-mode');
    }
}

// Event listener for the theme toggle button
if (themeToggleButton) {
    themeToggleButton.addEventListener('click', toggleTheme);
}

// Apply the saved theme on page load, or default to dark-mode if no preference is found
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        // Default to dark mode if no theme is saved (matches your CSS default)
        setTheme('dark-mode');
    }
});

// --- 1.2. Header Sticky Effect & Mobile Menu Toggle ---
const mainHeader = document.querySelector('.main-header');
const mobileMenuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navDropdowns = document.querySelectorAll('.nav-item.dropdown');

// Function for sticky header effect
function handleHeaderScroll() {
    // Add a class to the header when scrolled past a certain point
    if (window.scrollY > 80) { // Adjust this value as needed
        mainHeader.classList.add('scrolled');
    } else {
        mainHeader.classList.remove('scrolled');
    }
}

// Event listener for scroll to apply sticky header
window.addEventListener('scroll', handleHeaderScroll);
// Call once on load in case page is already scrolled down
document.addEventListener('DOMContentLoaded', handleHeaderScroll);

// Mobile menu toggle functionality
if (mobileMenuToggle && navLinks) {
    mobileMenuToggle.addEventListener('click', () => {
        // Toggle 'active' class on the menu button for animation
        mobileMenuToggle.classList.toggle('active');
        // Toggle 'active' class on the nav links to show/hide the menu
        navLinks.classList.toggle('active');

        // Close any open dropdowns when the main menu is toggled
        navDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    });

    // Close mobile menu when a nav link is clicked (optional, good for single-page apps)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            // Check if the clicked link is not a dropdown toggle
            if (!link.classList.contains('dropdown-toggle')) {
                mobileMenuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });
}

// Dropdown menu toggle for mobile (and hover for desktop)
if (navDropdowns.length > 0) {
    navDropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('.dropdown-toggle');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');

        if (dropdownToggle && dropdownMenu) {
            // For desktop, CSS :hover handles it. For mobile, we need a click.
            dropdownToggle.addEventListener('click', (e) => {
                // Prevent default link behavior if it's primarily a toggle
                e.preventDefault();
                // Check if it's a mobile view (or just always toggle on click)
                if (window.innerWidth <= 768) { // Matches your mobile breakpoint
                    // Toggle 'active' class on the parent dropdown item
                    dropdown.classList.toggle('active');
                    // Toggle max-height for smooth open/close animation on mobile
                    if (dropdown.classList.contains('active')) {
                        dropdownMenu.style.maxHeight = dropdownMenu.scrollHeight + 'px';
                    } else {
                        dropdownMenu.style.maxHeight = '0';
                    }

                    // Close other dropdowns if open
                    navDropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
                            otherDropdown.classList.remove('active');
                            otherDropdown.querySelector('.dropdown-menu').style.maxHeight = '0';
                        }
                    });
                }
            });

            // Reset max-height on window resize for desktop view
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    dropdownMenu.style.maxHeight = ''; // Remove inline style for desktop hover
                    dropdown.classList.remove('active'); // Ensure mobile active class is off
                }
            });
        }
    });
}

// --- 1.3. Back to Top Button ---
const backToTopButton = document.querySelector('.back-to-top');

// Show/hide button on scroll
function handleBackToTopVisibility() {
    if (window.scrollY > 300) { // Show button after scrolling 300px down
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
}

// Smooth scroll to top on click
if (backToTopButton) {
    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default anchor link behavior
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Smooth scroll animation
        });
    });
}

// Event listeners for back-to-top
window.addEventListener('scroll', handleBackToTopVisibility);
document.addEventListener('DOMContentLoaded', handleBackToTopVisibility); // Check on load

// --- 1.4. Custom Cursor ---
// Check if the device is a touch device (optional, but good for accessibility)
const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
};

if (!isTouchDevice()) { // Only enable custom cursor for non-touch devices
    const customCursorDot = document.createElement('div');
    customCursorDot.classList.add('custom-cursor-dot');
    document.body.appendChild(customCursorDot);

    const customCursorOutline = document.createElement('div');
    customCursorOutline.classList.add('custom-cursor-outline');
    document.body.appendChild(customCursorOutline);

    // Track mouse position
    let mouseX = 0;
    let mouseY = 0;

    // Track cursor element positions (for smooth follow)
    let dotX = 0;
    let dotY = 0;
    let outlineX = 0;
    let outlineY = 0;

    // Easing for smooth animation
    const easeFactorDot = 0.1;
    const easeFactorOutline = 0.2;

    // Function to animate cursor
    function animateCursor() {
        dotX += (mouseX - dotX) * easeFactorDot;
        dotY += (mouseY - dotY) * easeFactorDot;
        customCursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) scale(1)`;

        outlineX += (mouseX - outlineX) * easeFactorOutline;
        outlineY += (mouseY - outlineY) * easeFactorOutline;
        customCursorOutline.style.transform = `translate3d(${outlineX}px, ${outlineY}px, 0) scale(1)`;

        requestAnimationFrame(animateCursor); // Loop animation
    }

    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Start cursor animation
    requestAnimationFrame(animateCursor);

    // Cursor hover effects on interactive elements
    const hoverableElements = document.querySelectorAll(
        'a, button, .cta-button, .primary-button, .secondary-cta-button, .learn-more-button, .view-project-button, .banner-cta-button, .submit-button, .pagination-button, .category-button, .filter-button, .service-card, .portfolio-item, .team-member-card, .blog-post-card, .social-icon, .fact-item, .theme-toggle'
    );

    hoverableElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hover-effect');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hover-effect');
        });
    });
}
