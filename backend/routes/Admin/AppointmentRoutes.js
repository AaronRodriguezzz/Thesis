const express = require('express');
const router = express.Router();
const Appointment = require('../../controller/Admin/AppointmentControls');
const { verifyEmployeeToken } = require('../../middleware/Auth');

router.get('/api/all_appointments', verifyEmployeeToken, Appointment.getAllAppointments);
router.get('/api/appointments/:branchId', verifyEmployeeToken, Appointment.getAppointmentsByHour);
router.get('/api/branch_appointments/:branchId', verifyEmployeeToken, Appointment.branchAppointments)
router.get('/api/today_appointments', verifyEmployeeToken, Appointment.today_appointments);
router.put('/api/update_appointment', verifyEmployeeToken, Appointment.update_appointment_status);

module.exports = router;