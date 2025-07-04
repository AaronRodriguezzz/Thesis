const mongoose = require('mongoose');

const WalkInSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: false, // optional in case it's anonymous walk-in
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    additionalServices: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
    },
    barber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        default: ''
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch',
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Cash', 'GCash'],
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee', // usually the front desk
        required: true,
    },
    status:{
        type: String,
        default: 'Waiting',
        enum: ['Waiting', 'Barbering', 'Finished']
    }
}, { timestamps: true });

module.exports = mongoose.model('WalkInSales', WalkInSchema);
