const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to handle CORS and headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Serve AASA file
app.get('/.well-known/apple-app-site-association', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, '.well-known/apple-app-site-association'));
});

// Handle all other routes
app.get('*', (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    const isInstagram = userAgent.includes('Instagram');
    const path = req.path === '/' ? '' : req.path;
    
    if (isInstagram) {
        // Special handling for Instagram
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <title>Opening WhatOutfit...</title>
                
                <!-- App Links meta tags -->
                <meta property="al:ios:url" content="wha7://${path}" />
                <meta property="al:ios:app_store_id" content="YOUR_APP_STORE_ID" />
                <meta property="al:ios:app_name" content="WhatOutfit" />
                
                <!-- Smart App Banner -->
                <meta name="apple-itunes-app" content="app-id=YOUR_APP_STORE_ID">
                
                <!-- Immediate redirect attempts -->
                <meta http-equiv="refresh" content="0;url=wha7://${path}">
                
                <style>
                    body {
                        font-family: -apple-system, system-ui, BlinkMacSystemFont;
                        text-align: center;
                        padding: 20px;
                    }
                    .button {
                        display: inline-block;
                        padding: 12px 24px;
                        background: #007AFF;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        margin: 10px 0;
                    }
                </style>
            </head>
            <body>
                <h2>Opening WhatOutfit...</h2>
                <p>Tap the button below if the app doesn't open automatically:</p>
                <a href="wha7://${path}" class="button">Open WhatOutfit</a>
                
                <script>
                    // Attempt to open app immediately
                    window.location.href = "wha7://${path}";
                    
                    // Fallback to App Store after delay
                    setTimeout(function() {
                        window.location.href = "https://apps.apple.com/app/idYOUR_APP_STORE_ID";
                    }, 2500);
                </script>
            </body>
            </html>
        `);
    } else {
        // Normal response for non-Instagram requests
        res.send('Deep Link Path: ' + path);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
