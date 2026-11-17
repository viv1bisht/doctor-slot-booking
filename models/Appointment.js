const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    patientPhone: {
      type: String,
      required: true,
      trim: true
    },

    doctorId: {
      type: String,
      required: true,
      trim: true
    },

    slotTime: {
      type: Date,
      required: true
    },

    status: {
      type: String,
      enum: ["booked"],
      default: "booked"
    }
  },
  {
    timestamps: true
  }
);

// Prevent two patients from booking the same doctor slot
appointmentSchema.index(
  { doctorId: 1, slotTime: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Appointment",
  appointmentSchema
);