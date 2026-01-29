const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Security headers middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        server: 'Azure Node.js Web App',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/system', (req, res) => {
    res.json({
        nodeVersion: process.version,
        platform: process.platform,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
    });
});

app.get('/api/quote', (req, res) => {
    const quotes = [
        "The only way to do great work is to love what you do. - Steve Jobs",
        "Innovation distinguishes between a leader and a follower. - Steve Jobs",
        "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
        "Strive not to be a success, but rather to be of value. - Albert Einstein",
        "The best time to plant a tree was 20 years ago. The second best time is now. - Chinese Proverb",
        "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
        "The purpose of our lives is to be happy. - Dalai Lama",
        "Life is what happens to you while you're busy making other plans. - John Lennon"
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ quote: randomQuote });
});

// Contact form endpoint
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            message: 'All fields are required' 
        });
    }
    
    // In production, you would save to database or send email
    console.log(`Contact form submission: ${name} (${email}): ${message}`);
    
    res.json({ 
        success: true, 
        message: 'Message received successfully!',
        data: { name, email, message }
    });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: 'API endpoint not found',
        availableEndpoints: ['/api/health', '/api/system', '/api/quote', '/api/contact']
    });
});

// 404 handler for all other routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`
    🚀 Server is running!
    🔗 Local: http://localhost:${PORT}
    🌐 Environment: ${process.env.NODE_ENV || 'development'}
    📅 Started: ${new Date().toLocaleString()}
    🖥️  PID: ${process.pid}
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

module.exports = app;