const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    firstName: { 
        type: String, 
        required: true 
    },
    lastName: {
        type: String, 
        required: true 
    },
    phone: { 
        type: String, 
        unique: true 
    },
    email: { 
        type: String,
        required: true,
        unique: true 
    },
    password:{
        type: String,
        select: false
    },
    address:{
        type: String,
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
    },
},{ timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);