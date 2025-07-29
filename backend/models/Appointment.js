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
        ref: 'Service',
        required: false
    },
    branch: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Branch',
        required: true
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
        enum: ['Booked', 'Assigned', 'Completed', 'Cancelled', 'No-Show'], 
        default: 'Booked' 
    },
    paymentMethod: {
        type: String, 
        enum: ['Cash', 'Gcash'], 
        default: 'Cash'
    },  
    uniqueCode: {
        type: String, 
        required: true
    }
},{ timestamps: true });

module.exports = mongoose.model('Appointment', AppointmentSchema);