const express = require('express');
const router = express.Router();
const Appointment = require('../../controller/Customers/Appointment');
const { verifyToken } = require('../../middleware/Auth');

router.get('/api/initialize_appointment_info', Appointment.appointment_initial_data);
router.post('/api/new_appointment', verifyToken, Appointment.appointment_creation);
router.put('/api/appointment_cancellation/:id', verifyToken, Appointment.appointment_cancellation);
router.put('/api/appointment_update', verifyToken,  Appointment.appointment_update);

module.exports = router;