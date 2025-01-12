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

// Handle root path
app.get('/', (req, res) => {
  res.send('Universal Links Server');
});

// Handle all other paths for deep linking
app.get('*', (req, res) => {
  res.send('Deep Link Path: ' + req.path);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
