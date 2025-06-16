import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppointmentForm from "./User/AppointmentForm";
import HomePage from "./User/HomePage";
import Login from "./User/Login";
import QueueingForm from "./User/QueueingForm";
import Registration from "./User/Registration";
import Faq from "./User/FrequentlyQuestions";

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/appointment" element={<AppointmentForm />} />
        <Route path="/queueing" element={<QueueingForm />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
