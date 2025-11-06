// index.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Hi from sample-app by Dharun' });
});

module.exports = app;
