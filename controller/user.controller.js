const User = require("../model/User");
const bcrypt = require("bcryptjs");
const cloudinary = require("../Config/cloudinaryConfig");
const fs = require("fs");

exports.createUser = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        let avatarUrl = "";

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            avatarUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const user = await User.create({ name, email, password: hashedPassword, phone, address, avatar: avatarUrl });
        res.status(201).json({ success: true, data: user });
    } catch {
        res.status(500).json({ success: false, message: "User creation failed" });
    }
};

exports.getUsers = async (req, res) => {
    const users = await User.find().select("-password");
    res.json({ success: true, data: users });
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, address } = req.body;
        let avatarUrl = req.body.avatar;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            avatarUrl = result.secure_url;
            fs.unlinkSync(req.file.path);
        }

        const user = await User.findByIdAndUpdate(id, { name, phone, address, avatar: avatarUrl }, { new: true });
        res.json({ success: true, data: user });
    } catch {
        res.status(500).json({ success: false, message: "User update failed" });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "User deleted" });
    } catch {
        res.status(500).json({ success: false, message: "User deletion failed" });
    }
};
