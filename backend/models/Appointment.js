const mongoose = require('mongoose');


const AppointmentSchema = new mongoose.Schema({
    customer: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Customer', 
        required: true
    },
    service: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service',
        required: true
    },
    additionalService: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Service' 
    },
    branch: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Branch' 
    },
    barber:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Employee',
    },
    scheduledDate: { 
        type: Date, 
        required: true 
    },
    scheduledTime: {
        type: Number,
        required: true,
    },
    status: { 
        type: String, 
        enum: ['booked', 'completed', 'cancelled'], 
        default: 'booked' 
    },
},{ timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);