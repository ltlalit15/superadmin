const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    name: String,
    priceMonthly: Number,
    priceYearly: Number,
    description: String,
    features: [String],
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    } // <-- Array of strings
}, {
    timestamps: true
});

module.exports = mongoose.model("Plan", planSchema);
