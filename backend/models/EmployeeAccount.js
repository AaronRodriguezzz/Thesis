const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    fullName: {
        type: String, 
        required: true      
    },
    imagePath: {
      type: String,
      required: false,  
    },
    password: { 
        type: String, 
        required: true, 
        select: false
    },
    branchAssigned: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Branch',
    },
    role: { 
        type: String, 
        enum: ['Barber', 'Front Desk', 'Admin'], 
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Unavailable',
        enum: ['Available', 'Unavailable', 'On-break', 'Barbering', 'On Leave']
    }, 
    dateUnavailable: {
        type: Date,
        required: false,
    },
    customerTypeAssigned: {
        type: String,
        enum: ['Walk-In', 'Appointment']
    }

},{ timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);