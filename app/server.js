const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Logging middleware
app.use(morgan('combined'));

// Parse JSON bodies
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API endpoints
app.get('/api/info', (req, res) => {
  res.json({
    message: 'This is UMEOKOLI VINCENT TOCHUKWU, a Devops Engineer. Welcome to the AKS Web Application Demo!',
    version: '1.0.0',
    platform: process.platform,
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/users', (req, res) => {
  // Mock user data
  const users = [
    { id: 1, name: 'Umeokoli Vincent Tochukwu', email: 'umeokolivincent@gmail.com' },
    { id: 2, name: 'Okereke Glory Onyeche', email: 'umeoke63@gmail.com' },
    { id: 3, name: 'Ozumba Johnpaul Abuchi', email: 'ozumbajohnpaul@example.com' }
  ];

  res.json({
    data: users,
    total: users.length
  });
});

// Main route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AKS WebApp Demo</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                padding: 30px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            }
            h1 {
                color: #fff;
                text-align: center;
                margin-bottom: 30px;
            }
            .info-card {
                background: rgba(255, 255, 255, 0.2);
                padding: 20px;
                margin: 15px 0;
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            .btn {
                background: #4CAF50;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin: 5px;
                text-decoration: none;
                display: inline-block;
            }
            .btn:hover {
                background: #45a049;
            }
            .status {
                color: #4CAF50;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 AKS WebApp Demo</h1>
            <div class="info-card">
                <h3>Application Status: <span class="status">Running</span></h3>
                <p><strong>Platform:</strong> Azure Kubernetes Service (AKS)</p>
                <p><strong>Container Registry:</strong> Azure Container Registry (ACR)</p>
                <p><strong>CI/CD:</strong> GitHub Actions</p>
                <p><strong>Node.js Version:</strong> ${process.version}</p>
                <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
            </div>

            <div class="info-card">
                <h3>API Endpoints</h3>
                <a href="/api/info" class="btn">📋 App Info</a>
                <a href="/api/users" class="btn">👥 Users</a>
                <a href="/health" class="btn">💊 Health Check</a>
            </div>

            <div class="info-card">
                <h3>Features Demonstrated</h3>
                <ul>
                    <li>✅ Containerized Node.js application</li>
                    <li>✅ Kubernetes deployment with health checks</li>
                    <li>✅ Azure Container Registry integration</li>
                    <li>✅ GitHub Actions CI/CD pipeline</li>
                    <li>✅ Infrastructure as Code with Terraform</li>
                    <li>✅ Production-ready security headers</li>
                    <li>✅ Monitoring and logging</li>
                </ul>
            </div>
        </div>
    </body>
    </html>
  `);
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.originalUrl
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;