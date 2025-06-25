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
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Branch',
        required: true,
    },
    role: { 
        type: String, 
        enum: ['Barber', 'Front Desk'], 
    },

},{ timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);