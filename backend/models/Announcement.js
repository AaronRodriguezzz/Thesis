const mongoose = require('mongoose');

const Announcement = new mongoose.Schema({
    subject: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    expiration: {
        type: Date,
        required: true
    }, 
    status: {
        type: 'String',
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }
},{ timestamps: true });

module.exports = mongoose.model('Announcement', Announcement);