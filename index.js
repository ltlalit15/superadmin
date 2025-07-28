const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const cors = require('cors')
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Multer Setup
const upload = multer({ dest: "uploads/" });

// Cloudinary Config
cloudinary.config({
  cloud_name: "dp312afar",
  api_key: "377952276627195",
  api_secret: "xT2w13WCt2OTY7qbytNEOAo1Zr4",
});
// MONGO_DB_URL=mongodb+srv://mohammadrehan00121:vaE7znCuzLwYWxJN@cluster0.kiyzftb.mongodb.net/pet

// MongoDB Connection
mongoose.connect("mongodb+srv://mohammadrehan00121:vaE7znCuzLwYWxJN@cluster0.kiyzftb.mongodb.net/superadmin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected")).catch(console.error);

// ======= Models =======

const planSchema = new mongoose.Schema({
  name: String,
  priceMonthly: Number,
  priceYearly: Number,
  description: String,
});
const Plan = mongoose.model("Plan", planSchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  address: String,
  avatar: String,
});
const User = mongoose.model("User", userSchema);

// ======= Plan Routes =======

app.post("/plan", async (req, res) => {
  try {
    const { name, priceMonthly, priceYearly, description } = req.body;
    const plan = await Plan.create({ name, priceMonthly, priceYearly, description });
    res.status(201).json({ success: true, data: plan });
  } catch (err) {
    res.status(500).json({ success: false, message: "Plan creation failed" });
  }
});

app.get("/plan", async (req, res) => {
  const plans = await Plan.find();
  res.json({ success: true, data: plans });
});

app.put("/plan", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, priceMonthly, priceYearly, description } = req.body;
    const plan = await Plan.findByIdAndUpdate(id, { name, priceMonthly, priceYearly, description }, { new: true });
    res.json({ success: true, data: plan });
  } catch {
    res.status(500).json({ success: false, message: "Plan update failed" });
  }
});

app.delete("/plan", async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Plan deleted" });
  } catch {
    res.status(500).json({ success: false, message: "Plan deletion failed" });
  }
});

// ======= User Routes =======

app.post("/user", upload.single("avatar"), async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let avatarUrl = "";

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      avatarUrl = uploadResult.secure_url;
      fs.unlinkSync(req.file.path); // remove local file
    }

    const user = await User.create({
      name, email, password: hashedPassword, phone, address, avatar: avatarUrl
    });

    res.status(201).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: "User creation failed" });
  }
});

app.get("/user", async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, data: users });
});

app.put("/user", upload.single("avatar"), async (req, res) => {
  try {
    const {id}= req.params;

    const {  name, phone, address } = req.body;
    let avatarUrl = req.body.avatar;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path);
      avatarUrl = uploadResult.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const user = await User.findByIdAndUpdate(id, {
      name, phone, address, avatar: avatarUrl
    }, { new: true });

    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, message: "User update failed" });
  }
});

app.delete("/user", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch {
    res.status(500).json({ success: false, message: "User deletion failed" });
  }
});

// ======= Login Route =======

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "process.env.JWT_SECRET", {
      expiresIn: "7d"
    });

    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar }
    });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

// ======= Start Server =======

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
