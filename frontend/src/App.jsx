import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// User Pages
import AppointmentForm from "./User/AppointmentForm";
import HomePage from "./User/HomePage";
import Login from "./User/Login";
import QueueingForm from "./User/QueueingForm";
import Registration from "./User/Registration";
import Faq from "./User/FrequentlyQuestions";
import FeedbackForm from "./User/FeedbackForm";
import ProfilePage from "./User/Profile";
import AppointmentHistory from "./User/AppointmentHistory";

// Admin Pages
import Dashboard from "./Admin/Dashboard";
import Appointments from "./Admin/Appointments";
import Branches from "./Admin/Branches";
import Customers from "./Admin/Customers";
import Employees from "./Admin/Employees";
import Products from "./Admin/Products";
import Sales from "./Admin/Sales";
import Services from "./Admin/Services";
import Schedules from "./Admin/Schedules";
import AdminLogin from "./Admin/Login";

// Layouts
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Layout */}
        <Route element={<UserLayout />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/my-appointments" element={<AppointmentHistory />} />
          <Route path="/appointment" element={<AppointmentForm />} />
          <Route path="/queueing" element={<QueueingForm />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/feedback" element={<FeedbackForm />} />
          <Route path="/" element={<HomePage />} />

        </Route>

        {/* Admin Layout */}  
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="branches" element={<Branches />} />
          <Route path="customers" element={<Customers />} />
          <Route path="employees" element={<Employees />} />
          <Route path="products" element={<Products />} />
          <Route path="sales" element={<Sales />} />
          <Route path="schedules" element={<Schedules />} />
          <Route path="services" element={<Services />} />
        </Route>

        {/* (outside layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* 404 */}
        <Route path="*" element={<div className="text-center mt-20 text-2xl">404 - Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
