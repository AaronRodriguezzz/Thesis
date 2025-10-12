require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const { verifyToken, verifyAdminToken} = require('./middleware/Auth');

// Routes Import
//Admin Routes
const AdminAuth = require('./routes/Admin/AdminAuthRoutes');
const AppointmentRoutes = require('./routes/Admin/AppointmentRoutes');
const BranchRoutes = require('./routes/Admin/BranchRoutes');
const CustomerRoutes = require('./routes/Admin/CustomerRoutes');
const DashboardRoutes = require('./routes/Admin/DashboardRoute');
const EmployeeRoutes = require('./routes/Admin/EmployeeRoutes');
const ProductRoutes = require('./routes/Admin/ProductRoutes');
const SalesRoutes = require('./routes/Admin/SalesRoutes');
const ServiceRoutes = require('./routes/Admin/ServicesRoutes');
const AnnouncementRoutes = require('./routes/Admin/AnnouncementRoute');

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
const AiRoutes = require('./routes/Customer/AiRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/uploads/employees", express.static("uploads/employees"));
app.use("/uploads/products", express.static("uploads/products"));
app.use("/uploads/branches", express.static("uploads/branches"));

//global state for the queue
global.queueState = {};

app.get('/api/protected', (req, res) => {
    const token = req.cookies.user; 
    
    if (!token) {
      return res.status(401).json({ message: 'No token found' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.json({ message: 'Access granted', user: decoded });
    } catch (err) {
        res.status(403).json({ message: err.message });
    }
});

app.post("/api/logout", (req, res) => {
  res.clearCookie("user", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({ message: "Logged out successfully" });
});


app.use((req,res,next) => {
    console.log(req.path, req.method);
    next()
})


//use router for customer
app.use(CustomerAuth);
app.use(CustomerAppointment);
app.use(Reviews);
app.use(Getter);
app.use(Subscriber);
app.use(AiRoutes);


app.use(AdminAuth);
app.use(BranchRoutes);
app.use(AnnouncementRoutes);
app.use(AssignmentRoutes);
app.use(verifyAdminToken, [
  AppointmentRoutes,
  CustomerRoutes,
  DashboardRoutes,
  EmployeeRoutes,
  ProductRoutes,
  SalesRoutes,
  ServiceRoutes,
  WalkInRoutes,
  POSRoutes
]);


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