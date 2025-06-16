const express = require('express');
const router = express.Router();
const Appointment = require('../../controller/Admin/AppointmentControls');

router.get('/api/all_appointments', Appointment.getAllAppointments);

module.exports = router;