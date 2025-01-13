const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Middleware for CORS and headers
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
                <title>WhatOutfit</title>
                
                <!-- App Links meta tags -->
                <meta property="al:ios:url" content="wha7://${path}" />
                <meta property="al:ios:app_store_id" content="YOUR_APP_STORE_ID" />
                <meta property="al:ios:app_name" content="WhatOutfit" />
                
                <!-- Smart App Banner -->
                <meta name="apple-itunes-app" content="app-id=YOUR_APP_STORE_ID">
            </head>
            <body>
                <script>
                    // Try to open the app
                    window.location.href = "wha7://${path}";
                    
                    // Redirect to main website after a brief delay
                    setTimeout(function() {
                        window.location.href = "https://wha7.com${path}";
                    }, 500);
                </script>
            </body>
            </html>
        `);
    } else {
        // For non-Instagram requests, redirect to main website
        res.redirect(`https://wha7.com${path}`);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
