const Admin = require('../model/Admin');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
// Create Admin (Only Superadmin should access this route)
exports.createAdmin = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, role } = req.body;

        // Basic validations
        if (!name || !email || !password || !confirmPassword || !role) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        // Check if email already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(409).json({ message: "Email already in use." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create admin
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newAdmin.save();
        res.status(201).json({ message: "Admin created successfully." });

    } catch (error) {
        console.error("Create Admin Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await Admin.find().select("-password"); // hide passwords
        res.status(200).json(admins);
    } catch (error) {
        console.error("Get All Admins Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};



exports.deleteAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const deletedAdmin = await Admin.findByIdAndDelete(adminId);

        if (!deletedAdmin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        res.status(200).json({ message: "Admin deleted successfully." });
    } catch (error) {
        console.error("Delete Admin Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


exports.updateAdmin = async (req, res) => {
    try {
        const adminId = req.params.id;
        const { name, email, role } = req.body;

        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            { name, email, role },
            { new: true }
        );

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        res.status(200).json({ message: "Admin updated successfully.", admin: updatedAdmin });
    } catch (error) {
        console.error("Update Admin Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};





exports.resetPassword = async (req, res) => {
    try {
        const adminId = req.params.id;
        const { newPassword, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ message: "Both password fields are required." });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match." });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            { password: hashedPassword },
            { new: true }
        );

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        res.status(200).json({ message: "Password reset successfully." });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


exports.toggleAdminStatus = async (req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) return res.status(404).json({ msg: "Admin not found" });

        const newStatus = admin.status === "Active" ? "Inactive" : "Active";
        admin.status = newStatus;
        await admin.save();

        res.json({ msg: `Status updated to ${newStatus}`, admin });
    } catch (err) {
        res.status(500).json({ msg: "Error toggling status", error: err.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;
        const userId = req.params.id;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ msg: 'All fields are required.' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ msg: 'New passwords do not match.' });
        }

        const user = await Admin.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Current password is incorrect.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ msg: 'Password updated successfully.' });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ msg: 'Something went wrong.' });
    }
};

exports.getAdminById = async (req, res) => {
    try {
        const adminId = req.params.id;

        // Check for valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(400).json({ message: "Invalid Admin ID." });
        }

        const admin = await Admin.findById(adminId).select("-password");

        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        res.status(200).json(admin);
    } catch (error) {
        console.error("Get Admin By ID Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};


exports.profileEdit = async (req, res) => {
    try {
        const adminId = req.params.id;
        const { name, email, role } = req.body;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(adminId)) {
            return res.status(400).json({ message: "Invalid Admin ID." });
        }

        // Optional: Check for required fields (if needed)


        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            { name, email, role },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedAdmin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        res.status(200).json({ message: "Admin updated successfully.", admin: updatedAdmin });
    } catch (error) {
        console.error("Update Admin Error:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};