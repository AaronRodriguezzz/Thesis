const express = require('express');
const router = express.Router();
const Appointment = require('../../controller/Customers/Appointment');

router.post('/api/new_appointment', Appointment.appointment_creation);
router.put('/api/appointment_cancellation', Appointment.appointment_cancellation);
router.put('/api/appointment_update', Appointment.appointment_update);
router.get('/api/initialize_appointment_info', Appointment.appointment_initial_data);

module.exports = router;