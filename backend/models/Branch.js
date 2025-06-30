const mongoose = require('mongoose');

const BranchSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    imagePath: {
        type: String, 
        required: true 
    },
    address: { 
        type: String, 
        required: true 
    },
    phone: { 
        type: String 
    },
    numberOfBarber: {
        type: Number, 
        required: true 
    }
},{ timestamps: true });

module.exports = mongoose.model('Branch', BranchSchema);