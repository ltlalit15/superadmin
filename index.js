const express = require("express");
const cors = require("cors");
const multer = require("multer");
const dotenv = require("dotenv");
const connectDB = require("./Config/db_config");

dotenv.config();
const app = express();

// ✅ Correct CORS setup
app.use(
  cors({
    origin: ["https://sellersaas.netlify.app","http://localhost:5173"], // ⚠️ Change to your frontend URL
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Multer Setup
const upload = multer({ dest: "uploads/" });
app.use((req, res, next) => {
  req.upload = upload;
  next();
});

// MongoDB Connect
connectDB();

// Routes
app.use("/", require("./routes/auth.routes"));
app.use("/", require("./routes/user.routes"));
app.use("/", require("./routes/plan.routes"));
app.use("/", require("./routes/adminRoutes"));
app.use("/", require("./routes/planBooking.routes"));
app.use("/", require("./routes/dashboard.routes"));
// app.use("/", require("./routes/orderRoutes"));
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
