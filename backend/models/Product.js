const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    imagePath: {
        type: String,
        required: true,
    },
    price: { 
        type: Number, 
        required: true 
    },
    stock: { 
        type: Number, 
        default: 0 
    },
    branch: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Branch', 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
},{ timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);