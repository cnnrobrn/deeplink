

// Handle all other routes with an HTML page that includes fallback to Wha7.com
app.get('*', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Redirecting...</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <p>Opening Wha7...</p>
        <script>
          // Try to open the app first
          window.location = 'com.wha7.app://${req.path}';
          
          // Redirect to Wha7.com after a short delay if app doesn't open
          setTimeout(function() {
            window.location.href = 'https://wha7.com';
          }, 1000);
        </script>
      </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
```
