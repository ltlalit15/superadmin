const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    address: String,
    avatar: String,
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
    status: { type: String, enum: ["active", "inactive"], default: "inactive" }
});

module.exports = mongoose.model("User", userSchema);
