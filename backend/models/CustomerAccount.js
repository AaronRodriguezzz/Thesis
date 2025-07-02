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
        required: true 
    },
    password:{
        type: String,
        required: true,
        select: false
    },
    status:{
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active',
        required: true,
    },
},{ timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);