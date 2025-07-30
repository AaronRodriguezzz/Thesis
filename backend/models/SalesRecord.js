const mongoose = require('mongoose');

const SalesRecordSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true }
    }],
    totalPrice: { 
        type: Number, 
        required: true
    },
    soldBy: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Employee', 
        required: true 
    },
    branch: { 
        type: mongoose.Schema.Types.ObjectId, ref: 'Branch', 
        required: true 
    },
},{ timestamps: true });

module.exports = mongoose.model('Sales', SalesRecordSchema);