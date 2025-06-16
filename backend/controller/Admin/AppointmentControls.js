const Appointment = require('../../models/Appointment'); // Adjust the path if needed


/**
 * @desc Gets all the appointment
 * @route GET /api/all_appointments
 * @access Public or Authenticated (based on your setup)
 */
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('customer')
            .populate('service')
            .populate('additionalService')
            .populate('branch')
            .populate('barber');

        res.status(200).json({ appointments });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching appointments', error: err.message });
    }
};

module.exports = {
    getAllAppointments
}
