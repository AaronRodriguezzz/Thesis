require('dotenv').config();
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const app = require('./index');  // Import the app from index.js

const notificationsHandler = require('./Services/NotificationService');
const queueingHandler = require('./Services/QueueingServices');

const server = http.createServer(app);         
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

notificationsHandler(io);
queueingHandler(io);

// MongoDB connection
mongoose.connect(process.env.DB_URI)
  .then(() => {
    console.log('Connected to the Database');
    server.listen(process.env.PORT || 4001, () => {
      console.log(`Listening on ${process.env.PORT || 4001}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    // Still try to start the server to test if server.listen works
    server.listen(4001, () => {
      console.log('⚠️ Server started WITHOUT DB connection on port 4001');
    });
});