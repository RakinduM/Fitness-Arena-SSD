import { body, param } from "express-validator";

// Feedback validation rules
export const validateFeedback = [
  body("firstName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be between 1-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be between 1-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("membershipId")
    .optional()
    .isLength({ max: 20 })
    .withMessage("Membership ID must be less than 20 characters"),

  body("topic")
    .isIn([
      "registrations",
      "workout schedules",
      "shopping",
      "appointments",
      "other",
    ])
    .withMessage(
      "Topic must be one of: registrations, workout schedules, shopping, appointments, other"
    ),

  body("feedback")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Feedback must be between 1-1000 characters"),
];

export const validateFeedbackUpdate = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("First name must be between 1-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Last name must be between 1-50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),

  body("membershipId")
    .optional()
    .isLength({ max: 20 })
    .withMessage("Membership ID must be less than 20 characters"),

  body("topic")
    .optional()
    .isIn([
      "registrations",
      "workout schedules",
      "shopping",
      "appointments",
      "other",
    ])
    .withMessage(
      "Topic must be one of: registrations, workout schedules, shopping, appointments, other"
    ),

  body("feedback")
    .optional()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Feedback must be between 1-1000 characters"),
];

// Workout validation rules
export const validateWorkout = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Workout title must be between 1-100 characters")
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage(
      "Workout title can only contain letters, numbers, spaces, hyphens and underscores"
    ),

  body("reps")
    .isInt({ min: 1, max: 1000 })
    .withMessage("Reps must be a number between 1-1000"),

  body("load")
    .isFloat({ min: 0, max: 10000 })
    .withMessage("Load must be a number between 0-10000"),

  body("userId")
    .optional()
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId"),
];

export const validateWorkoutUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Workout title must be between 1-100 characters")
    .matches(/^[a-zA-Z0-9\s\-_]+$/)
    .withMessage(
      "Workout title can only contain letters, numbers, spaces, hyphens and underscores"
    ),

  body("reps")
    .optional()
    .isInt({ min: 1, max: 1000 })
    .withMessage("Reps must be a number between 1-1000"),

  body("load")
    .optional()
    .isFloat({ min: 0, max: 10000 })
    .withMessage("Load must be a number between 0-10000"),
];

// Cart validation rules
export const validateCart = [
  body("menuItemId")
    .isMongoId()
    .withMessage("Menu item ID must be a valid MongoDB ObjectId"),

  body("quantity")
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be a number between 1-100"),

  body("email")
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
];

export const validateCartUpdate = [
  body("menuItemId")
    .optional()
    .isMongoId()
    .withMessage("Menu item ID must be a valid MongoDB ObjectId"),

  body("quantity")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Quantity must be a number between 1-100"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
];

// Parameter validation
export const validateObjectId = [
  param("id").isMongoId().withMessage("ID must be a valid MongoDB ObjectId"),
];

export const validateEmail = [
  param("email").isEmail().withMessage("Email must be a valid email address"),
];
