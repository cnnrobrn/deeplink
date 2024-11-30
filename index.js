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

// Specific test path
app.get('/open', (req, res) => {
  console.log('Path:', req.path);
  console.log('Headers:', req.headers);

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Opening Wha7</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: -apple-system, system-ui;">
        <div style="text-align: center; margin-top: 40px;">
          <p>Opening Wha7...</p>
        </div>
      </body>
    </html>
  `);
});

// Root path - immediate redirect
app.get('/', (req, res) => {
  res.redirect('https://wha7.com');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
