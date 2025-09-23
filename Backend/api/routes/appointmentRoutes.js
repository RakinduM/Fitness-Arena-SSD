import express from "express";
import requireAuth from "../Middleware/requireAuth.js";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentById,
  deleteAppointmentById,
} from "../controllers/appointmentController.js";

const router = express.Router();

// Apply auth middleware to all routes
router.use(requireAuth);

// Routes (now protected)
router.post("/", createAppointment);
router.get("/", getAllAppointments);
router.get("/:id", getAppointmentById);
router.put("/:id", updateAppointmentById);
router.delete("/:id", deleteAppointmentById);

export default router;
