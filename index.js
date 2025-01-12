// File: index.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Middleware for common headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Cache-Control', 'no-store');
    next();
});

// Serve static files from .well-known directory
app.use('/.well-known', express.static(path.join(__dirname, '.well-known')));

// Serve AASA file with correct MIME type
app.get('/.well-known/apple-app-site-association', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, '.well-known/apple-app-site-association'));
});

// Serve AASA at root level for compatibility
app.get('/apple-app-site-association', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, '.well-known/apple-app-site-association'));
});

// Root path
app.get('/', (req, res) => {
    const userAgent = req.headers['user-agent'];
    const isInstagram = userAgent && userAgent.includes('Instagram');
    
    if (isInstagram) {
        serveInstagramFallback(req, res);
    } else {
        res.send('Universal Links Server');
    }
});

// Handle all deep link paths
app.get('*', (req, res) => {
    const userAgent = req.headers['user-agent'];
    const isInstagram = userAgent && userAgent.includes('Instagram');
    
    if (isInstagram) {
        serveInstagramFallback(req, res);
    } else {
        res.send('Deep Link Path: ' + req.path);
    }
});

// Helper function to serve Instagram fallback page
function serveInstagramFallback(req, res) {
    const deepLinkPath = req.path.startsWith('/') ? req.path.slice(1) : req.path;
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Opening App...</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta http-equiv="refresh" content="0;url=myapp://${deepLinkPath}">
            
            <!-- App Links meta tags -->
            <meta property="al:ios:url" content="myapp://${deepLinkPath}" />
            <meta property="al:ios:app_store_id" content="YOUR_APP_STORE_ID" />
            <meta property="al:ios:app_name" content="YOUR_APP_NAME" />
            
            <!-- Smart banner for iOS -->
            <meta name="apple-itunes-app" content="app-id=YOUR_APP_STORE_ID">
            
            <style>
                body {
                    font-family: -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    text-align: center;
                    padding: 20px;
                    color: #333;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    margin: 10px;
                    background-color: #007AFF;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Opening App...</h1>
                <p>If the app doesn't open automatically, please tap the button below:</p>
                <a href="myapp://${deepLinkPath}" class="button">Open App</a>
                <p>Don't have the app?</p>
                <a href="https://apps.apple.com/app/idYOUR_APP_STORE_ID" class="button">Download from App Store</a>
            </div>
            <script>
                // Try to open the app immediately
                window.location.href = "myapp://${deepLinkPath}";
                
                // Fallback to App Store after delay if app isn't installed
                setTimeout(function() {
                    window.location.href = "https://apps.apple.com/app/idYOUR_APP_STORE_ID";
                }, 2500);
            </script>
        </body>
        </html>
    `;
    
    res.send(htmlContent);
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
