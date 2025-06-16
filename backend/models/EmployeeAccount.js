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
    password: { 
        type: String, 
        required: true 
    },
    branchAssigned: {
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ['Barber', 'Front Desk'], 
    },

},{ timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);