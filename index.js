const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/.well-known/apple-app-site-association', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.sendFile(path.join(__dirname, '.well-known/apple-app-site-association'));
});

app.get('*', (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    const isInstagram = userAgent.includes('Instagram');
    const path = req.path === '/' ? '' : req.path;
    
    if (isInstagram) {
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
                    // Try sequence:
                    // 1. Try universal link through custom scheme
                    window.location.href = "wha7://${path}";
                    
                    // 2. After a short delay, try to open App Store app directly
                    setTimeout(function() {
                        window.location.href = "itms-apps://itunes.apple.com/app/idYOUR_APP_STORE_ID";
                    }, 500);
                    
                    // 3. Finally, fallback to main website if neither worked
                    setTimeout(function() {
                        window.location.href = "https://wha7.com${path}";
                    }, 1000);
                </script>
            </body>
            </html>
        `);
    } else {
        res.redirect(`https://wha7.com${path}`);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
