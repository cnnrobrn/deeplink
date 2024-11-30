const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Serve the AASA file from the .well-known directory
app.get('/.well-known/apple-app-site-association', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(__dirname + '/apple-app-site-association');
});

// Optional: redirect root to the AASA file for testing
app.get('/', (req, res) => {
  res.redirect('/.well-known/apple-app-site-association');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
