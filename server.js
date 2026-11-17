require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const Appointment = require("./models/Appointment");

const appointmentRoutes = require("./routes/appointmentRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/appointments", appointmentRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// Start server after database and indexes are ready
const startServer = async () => {
  try {
    await connectDB();

    // Ensure unique indexes are created before accepting requests
    await Appointment.init();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();