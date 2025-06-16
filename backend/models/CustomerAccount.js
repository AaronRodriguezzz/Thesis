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
        type: String 
    },
    password:{
        type: String,
        required: true,
    },
},{ timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);