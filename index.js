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
                <title>Testing App Store Redirect</title>
                
                <!-- Using Instagram for testing -->
                <meta property="al:ios:url" content="instagram://" />
                <meta property="al:ios:app_store_id" content="389801252" />
                <meta property="al:ios:app_name" content="Instagram" />
                
                <!-- Smart App Banner for Instagram -->
                <meta name="apple-itunes-app" content="app-id=389801252">
            </head>
            <body>
                <script>
                    // Try to open Instagram
                    window.location.href = "instagram://";
                    
                    // Try to open App Store app after a short delay
                    setTimeout(function() {
                        window.location.href = "itms-apps://itunes.apple.com/app/id389801252";
                    }, 500);
                    
                    // Fallback to main website
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
