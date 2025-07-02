const Appointment = require('../../models/Appointment');
const Customer = require('../../models/CustomerAccount');
const Branch = require('../../models/Branch');
const EmailService = require('../../Services/EmailService');
const Services = require('../../models/Services');

/**
 * @desc Creates a new appointment
 * @route POST /api/new_appointment
 * @access Public or Authenticated (based on your setup)
 */
const appointment_creation = async (req, res) => {
    const {
        customer,
        service,
        additionalService,
        branch,
        barber,
        scheduledDate,
        scheduledTime,
    } = req.body;

    console.log(req.body);

    try {
        // Validate required fields
        const requiredFields = ['customer', 'service', 'branch', 'scheduledDate', 'scheduledTime'];
        const missingFields = requiredFields.filter(field => {
            const value = req.body[field];
                return (
                value === undefined ||
                value === null ||
                (typeof value === 'string' && value.trim() === '')
            );
        });

        if (missingFields.length > 0) {
            return res.status(400).json({ message: 'Please fill in all required fields.' });
        }

        const uniqueCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Create new appointment
        const appointment = new Appointment({
            customer,
            service,
            additionalService: additionalService ? additionalService : undefined,
            branch,
            barber,
            scheduledDate: new Date(scheduledDate),
            scheduledTime,
            uniqueCode  
        });

        const appointmentSaved = await appointment.save();

        if (!appointmentSaved) {
            return res.status(404).json({ message: 'Error saving the appointment' });
        }

        const customerData = await Customer.findById(customer)

        if(!customerData){
            return res.status(404).json({ message: 'Error sending appointment details' });
        }

        await EmailService.send_appointment_details(customerData.email, uniqueCode, scheduledDate, scheduledTime )

        return res.status(200).json({ message: 'Appointment saved', appointment: appointmentSaved });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err });
    }
};

const appointment_initial_data = async (req, res) => {
  try {
    // Get start and end of today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch today's appointments
    const appointments = await Appointment.find({
      scheduledDate: { $gte: startOfDay, $lte: endOfDay },
    });

    // // Count appointments per hour
    // const countsByHour = appointments.reduce((acc, appointment) => {
    //   const hour = appointment.scheduledTime;

    //   acc[hour] = (acc[hour] || 0) + 1;

    //   return acc;
    // }, {});

    // // Convert count object to array
    // const appointmentRecord = Object.entries(countsByHour).map(
    //   ([hour, count]) => ({
    //     hour: Number(hour),
    //     count,
    //   })
    // );

    // Fetch branches and services
    const [branches, services, appointmentRecord ] = await Promise.all([
      Branch.find(),
      Services.find(),
      Appointment.find({status: 'booked'})
    ]);

    return res
      .status(200)
      .json({ appointmentRecord, branches, services });

  } catch (err) {
    console.error("Error fetching appointments:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


/**
 * @desc Cancels (deletes) an existing appointment by ID
 * @route DELETE /api/appointments/:id
 * @access Public or Authenticated
 */
const appointment_cancellation = async (req, res) => {
    const { id } = req.params;

    try {
        const appointment = await Appointment.findById(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment does not exist' });
        }

        const deletedAppointment = await Appointment.findByIdAndDelete(id);

        return res.status(200).json({
            message: 'Appointment cancelled successfully',
            appointment: deletedAppointment,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * @desc Updates the status of an appointment
 * @route PATCH /api/appointments/status
 * @access Public or Authenticated
 */
const appointment_update = async (req, res) => {
    const { id, newStatus } = req.body;

    if (!id || !newStatus) {
        return res.status(400).json({ message: 'Invalid input data' });
    }

    try {
        const updatedData = await Appointment.findByIdAndUpdate(
            id,
            { status: newStatus },
            { new: true }
        );

        if (!updatedData) {
            return res.status(404).json({ message: 'Appointment not found or update failed' });
        }

        return res.status(200).json({ message: 'Update successful', appointment: updatedData });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    appointment_creation,
    appointment_cancellation,
    appointment_update,
    appointment_initial_data
};
