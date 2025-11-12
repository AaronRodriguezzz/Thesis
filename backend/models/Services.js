const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: ''
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String, 
    required: true,
    default: 'Active'
  },
  serviceType: {
    type: String,
    required: true,
    enums: ['Package Service', 'Additional Service']
  }
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

module.exports = mongoose.model('Service', ServiceSchema);