import express from "express";
import {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
  getFeedbacksByEmail,
} from "../controllers/feedbackControllers.js";
import {
  validateFeedback,
  validateFeedbackUpdate,
  validateObjectId,
  validateEmail,
} from "../Middleware/validationMiddleware.js";

const router = express.Router();

router.post("/", validateFeedback, createFeedback);
router.get("/email/:email", validateEmail, getFeedbacksByEmail);
router.get("/", getAllFeedback);
router.get("/:id", validateObjectId, getFeedbackById);
router.put(
  "/:id",
  validateObjectId,
  validateFeedbackUpdate,
  updateFeedbackById
);
router.delete("/:id", validateObjectId, deleteFeedbackById);

export default router;
