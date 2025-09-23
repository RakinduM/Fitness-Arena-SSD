import { appointment } from "../models/appointment.js";

// Create a new appointment (automatically linked to logged-in user)
export const createAppointment = async (req, res) => {
  try {
    const appointmentData = { ...req.body, userId: req.user._id }; // link to user
    const newAppointment = await appointment.create(appointmentData);
    res.status(201).json(newAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all appointments for logged-in user
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointment.find({ userId: req.user._id });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single appointment by ID (with ownership check)
export const getAppointmentById = async (req, res) => {
  try {
    const id = req.params.id;
    const appointmentData = await appointment.findById(id);

    if (!appointmentData) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // IDOR Fix: check if appointment belongs to logged-in user
    if (appointmentData.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(appointmentData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update appointment (ownership check)
export const updateAppointmentById = async (req, res) => {
  try {
    const id = req.params.id;
    const appointmentData = await appointment.findById(id);

    if (!appointmentData) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointmentData.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedAppointment = await appointment.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json(updatedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete appointment (ownership check)
export const deleteAppointmentById = async (req, res) => {
  try {
    const id = req.params.id;
    const appointmentData = await appointment.findById(id);

    if (!appointmentData) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointmentData.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    const deletedAppointment = await appointment.findByIdAndDelete(id);
    res.json(deletedAppointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
