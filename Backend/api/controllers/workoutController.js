import { workout } from "../models/workoutModels.js";
import { validationResult } from "express-validator";
import validator from "validator";

// Create a workout
export const createWorkout = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const { title, reps, load, userId } = req.body; // Assuming userId is provided in the request body

  try {
    // Sanitize input data
    const sanitizedData = {
      title: validator.escape(title).trim(),
      reps: parseInt(reps),
      load: parseFloat(load),
      user: userId,
    };

    const newItem = await workout.create(sanitizedData);
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({
      message: "Please provide title, reps, load, and userId for the workout.",
    });
  }
};

// Get all workouts
/*export const getWorkouts = async (req, res) => {
  try {/
    const workouts = await workout.find({}).sort({ createdAt: -1 }).populate('user');
    res.status(200).json(workouts);
  } catch (error) {
    console.error("Error retrieving workouts:", error);
    res.status(500).json({ message: "An error occurred while retrieving the workouts." });
  }
};*/

// Get all workouts for the logged-in user
export const getWorkouts = async (req, res) => {
  try {
    // Retrieve the user ID from req.user
    const userId = req.user._id;

    // Find workouts that belong to the user
    const workouts = await workout
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("user");
    res.status(200).json(workouts);
  } catch (error) {
    console.error("Error retrieving workouts:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the workouts." });
  }
};

// Get a single workout by ID
export const getWorkoutById = async (req, res) => {
  const { id } = req.params;

  try {
    const foundWorkout = await workout.findById(id).populate("user");

    if (!foundWorkout) {
      return res.status(404).json({ message: "Workout not found." });
    }

    res.status(200).json(foundWorkout);
  } catch (error) {
    console.error("Error retrieving workout:", error);
    res
      .status(500)
      .json({ message: "An error occurred while retrieving the workout." });
  }
};

// Delete a workout by ID
export const deleteWorkoutById = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedWorkout = await workout.findByIdAndDelete(id);

    if (!deletedWorkout) {
      return res.status(404).json({ message: "Workout not found." });
    }

    res.status(200).json({ message: "Workout deleted successfully." });
  } catch (error) {
    console.error("Error deleting workout:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the workout." });
  }
};

// Update a workout by ID
export const updateWorkoutById = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const { id } = req.params;
  const { title, reps, load } = req.body;

  try {
    // Sanitize input data
    const sanitizedData = {};
    if (title) sanitizedData.title = validator.escape(title).trim();
    if (reps) sanitizedData.reps = parseInt(reps);
    if (load) sanitizedData.load = parseFloat(load);

    const updatedWorkout = await workout.findByIdAndUpdate(id, sanitizedData, {
      new: true,
    });

    if (!updatedWorkout) {
      return res.status(404).json({ message: "Workout not found." });
    }

    res.status(200).json(updatedWorkout);
  } catch (error) {
    console.error("Error updating workout:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the workout." });
  }
};
