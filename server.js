const express = require('express');
const path = require('path');
const port = process.env.PORT || 5000;
const app = express();

// Serve static files from the build folder
app.use(express.static(path.join(__dirname, 'build')));

// Handles any requests that don't match the above routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});