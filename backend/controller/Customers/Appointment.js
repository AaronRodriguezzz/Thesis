const Appointment = require('../../models/Appointment');
const Customer = require('../../models/CustomerAccount');
const Branch = require('../../models/Branch');
const Employee = require('../../models/EmployeeAccount');
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
        totalAmount
    } = req.body;

    try {

        const uniqueCode = Math.floor(100000 + Math.random() * 900000).toString();

        // Create new appointment
        const appointment = new Appointment({
            customer,
            service,
            additionalService: additionalService ? additionalService : undefined,
            branch,
            barber: barber?.trim() ? barber : undefined,
            scheduledDate: new Date(scheduledDate),
            scheduledTime,
            totalAmount,
            uniqueCode  
        });

        const appointmentSaved = await appointment.save();

        console.log('appointment', appointmentSaved);

        if (!appointmentSaved) {
            return res.status(404).json({ message: 'Error saving the appointment' });
        }


        const customerData = await Customer.findById(customer)

        if(!customerData){
            return res.status(404).json({ message: 'Error sending appointment details' });
        }

        await EmailService.send_appointment_details(customerData.email, uniqueCode, scheduledDate, scheduledTime )

        
        const populatedAppointment = await Appointment.findById(appointmentSaved._id)
            .populate('customer', 'firstName email phone'); // select only needed fields

        global.sendAppointmentNotification(populatedAppointment);


        return res.status(200).json({ message: 'Appointment saved', appointment: appointmentSaved });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err });
    }
};

const appointment_initial_data = async (req, res) => {
  try {
    // Get start and end of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch branches and services
    const [branches, services, appointmentRecord, barbers] = await Promise.all([
        Branch.find(),
        Services.find(),
        Appointment.find({
            status: { $regex: /^booked$/, $options: 'i' },
        }),   
        Employee.find({role: 'Barber'})                         
    ]);
        
    return res
      .status(200)
      .json({ appointmentRecord, branches, services, barbers });    

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
