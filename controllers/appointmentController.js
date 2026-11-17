const Appointment = require("../models/Appointment");

const bookAppointment = async (req, res) => {
  try {
    const {
      requestId,
      patientPhone,
      doctorId,
      slotTime
    } = req.body;

    // 1. Validate required fields
    if (!requestId || !patientPhone || !doctorId || !slotTime) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // 2. Validate slot date
    const parsedSlotTime = new Date(slotTime);

    if (Number.isNaN(parsedSlotTime.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid slotTime"
      });
    }

    // 3. Check if request was already processed
    const existingRequest = await Appointment.findOne({
      requestId
    });

    if (existingRequest) {
      const samePayload =
        existingRequest.patientPhone === patientPhone &&
        existingRequest.doctorId === doctorId &&
        existingRequest.slotTime.getTime() === parsedSlotTime.getTime();

      if (!samePayload) {
        return res.status(409).json({
          success: false,
          message: "Request ID already used with different booking details"
        });
      }

      return res.status(200).json({
        success: true,
        message: "Booking already processed",
        appointment: existingRequest
      });
    }

    // 4. Create appointment
    const appointment = await Appointment.create({
      requestId,
      patientPhone,
      doctorId,
      slotTime: parsedSlotTime
    });

    // 5. Success response
    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment
    });

  } catch (error) {

    // 6. Handle MongoDB duplicate key error
    if (error.code === 11000) {

      // Same requestId was inserted by another request
      if (error.keyPattern?.requestId) {
        const existingRequest = await Appointment.findOne({
          requestId: req.body.requestId
        });

        if (existingRequest) {
          const samePayload =
            existingRequest.patientPhone === req.body.patientPhone &&
            existingRequest.doctorId === req.body.doctorId &&
            existingRequest.slotTime.getTime() ===
              new Date(req.body.slotTime).getTime();

          if (samePayload) {
            return res.status(200).json({
              success: true,
              message: "Booking already processed",
              appointment: existingRequest
            });
          }
        }

        return res.status(409).json({
          success: false,
          message: "Request ID already used"
        });
      }

      // Same doctor and slot already booked
      if (error.keyPattern?.doctorId) {
        return res.status(409).json({
          success: false,
          message: "This doctor slot is already booked"
        });
      }
    }

    console.error("Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = { bookAppointment };