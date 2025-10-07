import express from "express";
import {
  createWorkout,
  getWorkoutById,
  getWorkouts,
  deleteWorkoutById,
  updateWorkoutById,
} from "../controllers/workoutController.js";
import {
  validateWorkout,
  validateWorkoutUpdate,
  validateObjectId,
} from "../Middleware/validationMiddleware.js";

import requireAuth from "../middleware/requireAuth.js";

//require auth for all workout routes
const router = express.Router();

router.use(requireAuth);

//POST a new workout
router.post("/", validateWorkout, createWorkout);

//GET all workouts
router.get("/", getWorkouts);

//GEt a single workout
router.get("/:id", validateObjectId, getWorkoutById);

//DELETE a new workout
router.delete("/:id", validateObjectId, deleteWorkoutById);

//UPDATE workout
router.put("/:id", validateObjectId, validateWorkoutUpdate, updateWorkoutById);

export default router;
