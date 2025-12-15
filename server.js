const express = require('express');
const path = require('path');
// Heroku sets the port dynamically using the PORT environment variable
const port = process.env.PORT || 5000; 
const app = express();

// Serve the static files from the build folder
app.use(express.static(path.join(__dirname, 'build')));

// Any unknown request is served by index.html (important for React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});