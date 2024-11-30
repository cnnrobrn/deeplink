const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve the AASA file from the .well-known directory
app.get('/.well-known/apple-app-site-association', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(__dirname + '/apple-app-site-association');
});

// Handle all other routes with an HTML page that includes fallback to Wha7.com
app.get('*', (req, res) => {
  console.log('Headers:', req.headers);
  console.log('User Agent:', req.get('user-agent'));
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redirecting to Wha7</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script>
          // Use a proper URL scheme for the app
          function tryOpenApp() {
            // First try Universal Link
            if (window.location.href.startsWith('https://')) {
              // Already using https, let iOS handle it
              return;
            }
            
            // Fallback to website after delay
            setTimeout(function() {
              window.location.href = 'https://wha7.com';
            }, 1000);
          }
        </script>
      </head>
      <body onload="tryOpenApp()">
        <p style="text-align: center; margin-top: 40px; font-family: -apple-system, system-ui, BlinkMacSystemFont;">
          Opening Wha7...
        </p>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
