const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String, // URL or path to image
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // Reference to the provider (User model)
        required: true
    }
}, { timestamps: true });

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
