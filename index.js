// index.js
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve the AASA file with the correct MIME type
app.get('/.well-known/apple-app-site-association', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, '.well-known/apple-app-site-association'));
});

// Also serve it at the root level as an alternative location
app.get('/apple-app-site-association', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.sendFile(path.join(__dirname, '.well-known/apple-app-site-association'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});