const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/Admin");
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });


        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // ✅ Only block admin if status is not "Active"
        if (user.role === "admin" && user.status !== "Active") {
            return res.status(403).json({ message: "Admin is not active. Please contact superadmin." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            my_super_secret_token_123,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",

            user: {
                id: user._id,
                token: token,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
};
