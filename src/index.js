// index.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Hello from sample-app' });
});

module.exports = app;
