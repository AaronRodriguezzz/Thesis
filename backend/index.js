require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
// Routes Import
//Admin Routes
const AdminAuth = require('./routes/Admin/AdminAuthRoutes');
const AppointmentRoutes = require('./routes/Admin/AppointmentRoutes');
const BranchRoutes = require('./routes/Admin/BranchRoutes');
const CustomerRoutes = require('./routes/Admin/CustomerRoutes');
const EmployeeRoutes = require('./routes/Admin/EmployeeRoutes');
const ProductRoutes = require('./routes/Admin/ProductRoutes');
const SalesRoutes = require('./routes/Admin/SalesRoutes');
const ServiceRoutes = require('./routes/Admin/ServicesRoutes');

//Customer Routes
const CustomerAuth = require('./routes/Customer/CustomerAuthRoutes');
const CustomerAppointment = require('./routes/Customer/AppointmentRoutes');
const Getter = require('./routes/Customer/GetRoutes');
// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true}));
app.use('/uploads', express.static(path.join( , 'uploads')));
app.use("/uploads/employees", express.static("uploads/employees"));
app.use("/uploads/products", express.static("uploads/products"));
app.use((req,res,next) => {
    console.log(req.path, req.method);
    next()
})

//use routes 
app.use(AdminAuth);
app.use(AppointmentRoutes);
app.use(BranchRoutes);
app.use(CustomerRoutes);
app.use(EmployeeRoutes);
app.use(ProductRoutes);
app.use(SalesRoutes);
app.use(ServiceRoutes);

//use router for customer
app.use(CustomerAuth);
app.use(CustomerAppointment);
app.use(Getter);

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