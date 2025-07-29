const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    platform: { type: String, enum: ['Meesho', 'Amazon'], required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
