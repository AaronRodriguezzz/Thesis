const Appointment = require('../../models/Appointment'); // Adjust the path if needed


/**
 * @desc Gets all the appointment
 * @route GET /api/all_appointments
 * @access Public or Authenticated (based on your setup)
 */
const getAllAppointments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const totalCount = await Appointment.countDocuments();
        const pageCount = Math.ceil(totalCount / limit);

        const appointments = await Appointment.find()
            .populate('customer')
            .populate('service')
            .populate('additionalService')
            .populate('branch')
            .populate({
                path: 'barber',
                match: { role: 'Barber' }, 
                select: '-password'
            })            
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({ appointments, pageCount});
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching appointments', error: err.message });
    }
};

/**
 * @desc Gets all the appointment
 * @route GET /api/today_appointments
 * @access Public or Authenticated (based on your setup)
 */
const today_appointments = async (req, res) => {
    try {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date();
        endOfToday.setHours(23, 59, 59, 999); 

        const appointments = await Appointment.find({ createdAt: { $gte: startOfToday, $lte: endOfToday } })
            .populate('customer')
            .populate('service')
            .populate('branch')
            .populate('barber')
            

        return res.status(200).json({ appointments });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching appointments', error: err.message });
    }
};


/**
 * @desc Update the status only
 * @route PUT /api/update_appointment
 * @access Public or Authenticated (based on your setup)
 */
const update_appointment_status = async (req, res) => {
    const {currentlyUpdatingId, newStatus} = req.body.newData;

    try {        
        if(!currentlyUpdatingId || !newStatus) return res.status(400).json({message: 'Empty Fields'})

        const appointmentUpdate = await Appointment.findOneAndUpdate(
            { _id: currentlyUpdatingId }, 
            { status: newStatus },
            { new: true }
        );

        if(!appointmentUpdate) {
            return res.status(404).json({message: 'Updating Failed'}) 
        }   
            

        return res.status(200).json({ message:'Updating Successful', appointmentUpdate });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching appointments', error: err.message });
    }
};



module.exports = {
    getAllAppointments,
    today_appointments,
    update_appointment_status
}
