const mongoose = require('mongoose');

const AppointmentSales = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: false // Optional for walk-ins
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  branch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch',
    required: true
  },
  dateOfSale: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'GCash'],
    default: 'Cash'
  },
  remarks: {
    type: String,
    default: ''
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee', // Usually the front desk who logs it
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ServiceSales', AppointmentSales);