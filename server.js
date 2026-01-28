const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="ur">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mera Web Application</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    text-align: center;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    padding: 20px;
                }
                .container {
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 40px;
                    max-width: 800px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }
                h1 {
                    font-size: 2.8rem;
                    margin-bottom: 20px;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                }
                h2 {
                    font-size: 2rem;
                    margin: 30px 0 15px;
                    color: #ffd700;
                }
                p {
                    font-size: 1.2rem;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .steps {
                    text-align: left;
                    background: rgba(255, 255, 255, 0.15);
                    padding: 25px;
                    border-radius: 15px;
                    margin: 25px 0;
                }
                .step {
                    margin: 15px 0;
                    padding-left: 20px;
                    border-left: 3px solid #ffd700;
                }
                .success-box {
                    background: rgba(46, 204, 113, 0.2);
                    border: 2px solid #2ecc71;
                    padding: 20px;
                    border-radius: 10px;
                    margin-top: 30px;
                }
                .urdu-text {
                    font-family: 'Jameel Noori Nastaleeq', 'Urdu Typesetting', sans-serif;
                    font-size: 1.5rem;
                    direction: rtl;
                    color: #e6e6e6;
                }
                .info-box {
                    background: rgba(52, 152, 219, 0.2);
                    border: 2px solid #3498db;
                    padding: 15px;
                    border-radius: 10px;
                    margin: 15px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎉 Mera Web Application</h1>
                <p class="urdu-text">آپ کا ویب ایپلیکیشن کامیابی سے چل رہا ہے!</p>
                
                <div class="info-box">
                    <h2>🌐 Deployment Information</h2>
                    <p><strong>Server Status:</strong> ✅ Running</p>
                    <p><strong>Port:</strong> ${PORT}</p>
                    <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'Development'}</p>
                </div>

                <h2>📋 Azure Deployment Steps</h2>
                <div class="steps">
                    <div class="step">
                        <strong>Step 1:</strong> Git repository initialize karein
                    </div>
                    <div class="step">
                        <strong>Step 2:</strong> Azure CLI install karein
                    </div>
                    <div class="step">
                        <strong>Step 3:</strong> Azure mein login karein
                    </div>
                    <div class="step">
                        <strong>Step 4:</strong> Web App create karein
                    </div>
                    <div class="step">
                        <strong>Step 5:</strong> Code deploy karein
                    </div>
                </div>

                <div class="success-box">
                    <h2>✅ Successful Deployment</h2>
                    <p class="urdu-text">مبارک ہو! آپ کا ایپلیکیشن Azure پر ڈپلائی ہو گیا ہے۔</p>
                    <p>🎯 Node.js Version: ${process.version}</p>
                    <p>📊 Server Uptime: ${Math.floor(process.uptime())} seconds</p>
                </div>

                <div style="margin-top: 40px;">
                    <h3>🔗 Important Links</h3>
                    <p style="word-break: break-all;">
                        <strong>API Endpoints:</strong><br>
                        /api/health - Server health check<br>
                        /api/time - Current server time
                    </p>
                </div>
            </div>
        </body>
        </html>
    `);
});

// API Routes
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        server: 'Node.js Web App',
        version: '1.0.0'
    });
});

app.get('/api/time', (req, res) => {
    res.json({
        serverTime: new Date().toLocaleString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timestamp: Date.now()
    });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
    console.log(`🌐 Network URL: http://YOUR_IP:${PORT}`);
});