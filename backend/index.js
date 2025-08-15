require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const http = require('http');
const { Server } = require('socket.io');

// Routes Import
//Admin Routes
const AdminAuth = require('./routes/Admin/AdminAuthRoutes');
const AppointmentRoutes = require('./routes/Admin/AppointmentRoutes');
const BranchRoutes = require('./routes/Admin/BranchRoutes');
const CustomerRoutes = require('./routes/Admin/CustomerRoutes');
const DashboardRoutes = require('./routes/Admin/DashboardRoutes');
const EmployeeRoutes = require('./routes/Admin/EmployeeRoutes');
const ProductRoutes = require('./routes/Admin/ProductRoutes');
const SalesRoutes = require('./routes/Admin/SalesRoutes');
const ServiceRoutes = require('./routes/Admin/ServicesRoutes');

//Front Desk Routes
const AssignmentRoutes = require('./routes/FrontDesk/AssignmentRoutes');
const WalkInRoutes = require('./routes/FrontDesk/WalkInRoutes');
const POSRoutes = require('./routes/FrontDesk/POSRoutes');

//Customer Routes
const CustomerAuth = require('./routes/Customer/CustomerAuthRoutes');
const CustomerAppointment = require('./routes/Customer/AppointmentRoutes');
const Getter = require('./routes/Customer/GetRoutes');
const Reviews = require('./routes/Customer/ReviewsRoutes');
const Subscriber = require('./routes/Customer/SubscribeEmail');
const ChatBotRoutes = require('./routes/Customer/ChatbotRoutes');

//socket
const notificationsHandler = require('./Services/NotificationService');
const queueingHandler = require('./Services/QueueingServices');

// Initialize Express app
const app = express();

const server = http.createServer(app);         
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/uploads/employees", express.static("uploads/employees"));
app.use("/uploads/products", express.static("uploads/products"));
app.use("/uploads/branches", express.static("uploads/branches"));


app.use((req,res,next) => {
    console.log(req.path, req.method);
    next()
})

app.get('/api/protected', (req, res) => {
    const token = req.cookies.user; 
    
    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.json({ message: 'Access granted', user: decoded.user || decoded.employee});
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
});

notificationsHandler(io);
queueingHandler(io);

//use routes for admin
app.use(AdminAuth);
app.use(AppointmentRoutes);
app.use(BranchRoutes);
app.use(CustomerRoutes);
app.use(DashboardRoutes);
app.use(EmployeeRoutes);
app.use(ProductRoutes);
app.use(SalesRoutes);
app.use(ServiceRoutes);

//use routes for front desk
app.use(AssignmentRoutes);
app.use(WalkInRoutes);
app.use(POSRoutes);

//use router for customer
app.use(CustomerAuth);
app.use(CustomerAppointment);
app.use(Reviews);
app.use(Getter);
app.use(Subscriber);
app.use(ChatBotRoutes);

const dirname = path.resolve();

// Now you can use dirname
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(dirname, "/frontend/dist")));
  app.get(/(.*)/, (req, res) => {
    res.sendFile(path.resolve(dirname, "frontend", "dist", "index.html"));
  });
}

// Export the app to use it in server.js
module.exports = app;