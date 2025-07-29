// model/Activity.js
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    type: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Activity", activitySchema);
