const express = require('express');
const router = express.Router();
const Appointment = require('../../controller/Admin/AppointmentControls');

router.get('/api/all_appointments', Appointment.getAllAppointments);
router.get('/api/appointments/:branchId', Appointment.getAppointmentsByHour);
router.get('/api/branch_appointments/:branchId', Appointment.branchAppointments)
router.get('/api/today_appointments', Appointment.today_appointments);
router.put('/api/update_appointment', Appointment.update_appointment_status);

module.exports = router;