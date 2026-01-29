// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.getElementById('backToTop');
const toast = document.getElementById('toast');

// API Elements
const serverStatusText = document.getElementById('serverStatusText');
const serverUptime = document.getElementById('serverUptime');
const serverEnv = document.getElementById('serverEnv');
const nodeVersion = document.getElementById('nodeVersion');
const memoryBar = document.getElementById('memoryBar');
const memoryValue = document.getElementById('memoryValue');
const cpuBar = document.getElementById('cpuBar');
const cpuValue = document.getElementById('cpuValue');
const heapUsed = document.getElementById('heapUsed');
const heapTotal = document.getElementById('heapTotal');
const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const apiResult = document.getElementById('apiResult');

// Buttons
const refreshServer = document.getElementById('refreshServer');
const refreshSystem = document.getElementById('refreshSystem');
const refreshQuote = document.getElementById('refreshQuote');
const testApi = document.getElementById('testApi');

// Contact Form
const contactForm = document.getElementById('contactForm');
const formResult = document.getElementById('formResult');

// Current date in footer
const currentDateElement = document.getElementById('currentDate');
currentDateElement.textContent = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Initial data load
    loadServerStatus();
    loadSystemStats();
    loadQuote();
    
    // Set up auto-refresh for server status
    setInterval(loadServerStatus, 30000); // Every 30 seconds
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navLinks.classList.remove('active');
            }
        });
    });
    
    // Active nav link highlighting
    const navLinksElements = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksElements.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        // Show/hide back to top button
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    showToast(`Switched to ${newTheme} theme`);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
}

// Mobile Menu Toggle
menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.querySelector('i').className = 'fas fa-bars';
    }
});

// Back to Top
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Toast Notification
function showToast(message, type = 'success') {
    const toastIcon = toast.querySelector('i');
    const toastMessage = toast.querySelector('.toast-message');
    
    toastIcon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    toastIcon.style.color = type === 'success' ? '#48bb78' : '#f56565';
    toastMessage.textContent = message;
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// API Functions
async function loadServerStatus() {
    try {
        serverStatusText.innerHTML = '<span class="loading"></span> Loading...';
        
        const response = await fetch('/api/health');
        if (!response.ok) throw new Error('Server not responding');
        
        const data = await response.json();
        
        serverStatusText.innerHTML = '<i class="fas fa-check-circle" style="color: #48bb78;"></i> Healthy';
        serverEnv.textContent = data.environment;
        
        // Format uptime
        const uptime = Math.floor(data.uptime);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        serverUptime.textContent = `${hours}h ${minutes}m ${seconds}s`;
        
        // Update footer status
        document.getElementById('footerStatus').innerHTML = 
            '<i class="fas fa-circle" style="color: #48bb78; font-size: 0.8em;"></i> Online';
            
    } catch (error) {
        console.error('Error loading server status:', error);
        serverStatusText.innerHTML = '<i class="fas fa-exclamation-circle" style="color: #f56565;"></i> Offline';
        serverUptime.textContent = '--';
        serverEnv.textContent = '--';
        
        document.getElementById('footerStatus').innerHTML = 
            '<i class="fas fa-circle" style="color: #f56565; font-size: 0.8em;"></i> Offline';
    }
}

async function loadSystemStats() {
    try {
        const response = await fetch('/api/system');
        if (!response.ok) throw new Error('Failed to load system stats');
        
        const data = await response.json();
        
        // Update Node version
        nodeVersion.textContent = data.nodeVersion;
        
        // Memory usage
        const memUsage = data.memoryUsage;
        const usedMB = Math.round(memUsage.heapUsed / 1024 / 1024);
        const totalMB = Math.round(memUsage.heapTotal / 1024 / 1024);
        const memPercent = Math.round((memUsage.heapUsed / memUsage.heapTotal) * 100);
        
        heapUsed.textContent = `${usedMB} MB`;
        heapTotal.textContent = `${totalMB} MB`;
        memoryBar.style.width = `${memPercent}%`;
        memoryValue.textContent = `${memPercent}%`;
        
        // CPU usage (simulated for demo)
        const cpuPercent = Math.floor(Math.random() * 30) + 10; // Random between 10-40%
        cpuBar.style.width = `${cpuPercent}%`;
        cpuValue.textContent = `${cpuPercent}%`;
        
    } catch (error) {
        console.error('Error loading system stats:', error);
        nodeVersion.textContent = '--';
        heapUsed.textContent = '--';
        heapTotal.textContent = '--';
    }
}

async function loadQuote() {
    try {
        quoteText.innerHTML = '<span class="loading"></span> Loading...';
        
        const response = await fetch('/api/quote');
        if (!response.ok) throw new Error('Failed to load quote');
        
        const data = await response.json();
        const [quote, author] = data.quote.split(' - ');
        
        quoteText.textContent = quote;
        quoteAuthor.textContent = author ? `- ${author}` : '';
        
    } catch (error) {
        console.error('Error loading quote:', error);
        quoteText.textContent = 'Error loading quote. Please try again.';
        quoteAuthor.textContent = '';
    }
}

// Button Event Listeners
refreshServer.addEventListener('click', loadServerStatus);
refreshSystem.addEventListener('click', loadSystemStats);
refreshQuote.addEventListener('click', loadQuote);

testApi.addEventListener('click', async () => {
    try {
        apiResult.innerHTML = '<span class="loading"></span> Testing API...';
        
        const response = await fetch('/api/health');
        const data = await response.json();
        
        apiResult.textContent = JSON.stringify(data, null, 2);
        showToast('API test successful!');
        
    } catch (error) {
        console.error('API test failed:', error);
        apiResult.textContent = 'Error: API test failed. Please check server connection.';
        showToast('API test failed!', 'error');
    }
});

// Contact Form Submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (data.success) {
            formResult.className = 'form-result success';
            formResult.innerHTML = `
                <i class="fas fa-check-circle"></i> 
                ${data.message}
                <br><small>Thank you for your message, ${formData.name}!</small>
            `;
            
            contactForm.reset();
            showToast('Message sent successfully!');
        } else {
            throw new Error(data.message || 'Failed to send message');
        }
        
    } catch (error) {
        console.error('Contact form error:', error);
        formResult.className = 'form-result error';
        formResult.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message}`;
        showToast('Failed to send message', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Real-time clock for dashboard
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    const clockElement = document.getElementById('serverTime');
    if (clockElement) {
        clockElement.textContent = timeString;
    }
}

// Initialize clock
updateClock();
setInterval(updateClock, 1000);

// Add some interactive animations
document.querySelectorAll('.feature-card, .dashboard-card, .stat').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Add ripple effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;
        
        const ripple = document.createElement('span');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page loaded in ${loadTime}ms`);
    
    if (loadTime > 3000) {
        console.warn('Page load time is slow. Consider optimizing.');
    }
});

// Offline detection
window.addEventListener('online', () => {
    showToast('You are back online!');
    loadServerStatus();
});

window.addEventListener('offline', () => {
    showToast('You are offline. Some features may not work.', 'error');
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + D to toggle dark mode
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        themeToggle.click();
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        navLinks.classList.remove('active');
        menuToggle.querySelector('i').className = 'fas fa-bars';
    }
    
    // Ctrl/Cmd + R to refresh server status
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        loadServerStatus();
        showToast('Refreshed server status');
    }
});

// Initialize tooltips
document.querySelectorAll('[title]').forEach(element => {
    element.addEventListener('mouseenter', function() {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = this.title;
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
        tooltip.style.transform = 'translate(-50%, -100%)';
        
        this._tooltip = tooltip;
    });
    
    element.addEventListener('mouseleave', function() {
        if (this._tooltip) {
            this._tooltip.remove();
            this._tooltip = null;
        }
    });
});

// Add tooltip styles
const tooltipStyle = document.createElement('style');
tooltipStyle.textContent = `
    .tooltip {
        position: fixed;
        background: var(--dark-color);
        color: white;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 0.8rem;
        pointer-events: none;
        z-index: 10000;
        white-space: nowrap;
    }
    
    .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 5px;
        border-style: solid;
        border-color: var(--dark-color) transparent transparent transparent;
    }
`;
document.head.appendChild(tooltipStyle);