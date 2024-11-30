const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// Serve the AASA file
app.get('/.well-known/apple-app-site-association', (req, res) => {
  res.set({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*'
  });
  res.sendFile(__dirname + '/apple-app-site-association');
});

// Handle all other routes
app.get('*', (req, res) => {
  console.log('Path:', req.path);
  console.log('Headers:', req.headers);
  console.log('User Agent:', req.get('user-agent'));

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Opening Wha7</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="apple-itunes-app" content="app-id=6738637892">
      </head>
      <body style="font-family: -apple-system, system-ui;">
        <div style="text-align: center; margin-top: 40px;">
          <p>Opening Wha7...</p>
        </div>
        <script>
          let hasRedirected = false;
          
          function redirectToApp() {
            // Give iOS more time to handle the Universal Link
            setTimeout(function() {
              if (!hasRedirected) {
                hasRedirected = true;
                window.location.replace('https://wha7.com');
              }
            }, 2500); // Increased to 2.5 seconds
          }

          // Run on page load
          window.onload = redirectToApp;
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
