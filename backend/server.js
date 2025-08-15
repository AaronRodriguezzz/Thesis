require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./index');  // Import the app from index.js


// MongoDB connection
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('Connected to the Database');
    app.listen(process.env.PORT || 4001, () => {
      console.log(`Listening on ${process.env.CLIENT_URL || 4001}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    // Still try to start the server to test if app.listen works
    app.listen(4001, () => {
      console.log('⚠️ Server started WITHOUT DB connection on port 4001');
    });
  });