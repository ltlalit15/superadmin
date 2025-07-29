const mongoose = require("mongoose");

const planBookingSchema = new mongoose.Schema({
    company: { type: String, required: true },
    email: { type: String, required: true },
    plan: { type: String, required: true },
    billing: { type: String, enum: ["Monthly", "Yearly"], required: true },
    date: { type: Date, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    phone: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("PlanBooking", planBookingSchema);
