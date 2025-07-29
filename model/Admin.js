const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['superadmin', 'admin'],
        default: 'admin'
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"], // 0 = Inactive, 1 = Active
        default: "Active"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);
