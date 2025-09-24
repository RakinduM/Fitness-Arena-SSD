import { Feedback } from "../models/feedbackModel.js";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import validator from "validator";

// Controller for creating new feedback
async function createFeedback(req, res) {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const feedbackData = Array.isArray(req.body) ? req.body : [req.body];
    const createdFeedbacks = [];

    for (const data of feedbackData) {
      // Additional sanitization
      const sanitizedData = {
        firstName: validator.escape(data.firstName || "").trim(),
        lastName: validator.escape(data.lastName || "").trim(),
        email: validator.normalizeEmail(data.email || ""),
        membershipId: data.membershipId
          ? validator.escape(data.membershipId.toString()).trim()
          : null,
        topic: data.topic,
        feedback: validator.escape(data.feedback || "").trim(),
      };

      const feedback = new Feedback(sanitizedData);
      await feedback.save();
      createdFeedbacks.push(feedback);
    }

    res.status(201).send(createdFeedbacks);
  } catch (error) {
    res.status(400).send(error);
  }
}

// Controller for fetching all feedback
async function getAllFeedback(req, res) {
  try {
    const feedback = await Feedback.find();
    res.send(feedback);
  } catch (error) {
    res.status(500).send(error);
  }
}

// Controller for fetching feedback by ID
async function getFeedbackById(req, res) {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).send();
    }
    res.send(feedback);
  } catch (error) {
    res.status(500).send(error);
  }
}

// Controller for updating feedback by ID
async function updateFeedbackById(req, res) {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    // Sanitize input data
    const sanitizedData = {};
    if (req.body.firstName)
      sanitizedData.firstName = validator.escape(req.body.firstName).trim();
    if (req.body.lastName)
      sanitizedData.lastName = validator.escape(req.body.lastName).trim();
    if (req.body.email)
      sanitizedData.email = validator.normalizeEmail(req.body.email);
    if (req.body.membershipId)
      sanitizedData.membershipId = validator
        .escape(req.body.membershipId.toString())
        .trim();
    if (req.body.topic) sanitizedData.topic = req.body.topic;
    if (req.body.feedback)
      sanitizedData.feedback = validator.escape(req.body.feedback).trim();

    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      sanitizedData,
      {
        new: true,
      }
    );
    if (!feedback) {
      return res.status(404).send();
    }
    res.send(feedback);
  } catch (error) {
    res.status(400).send(error);
  }
}

// Controller for deleting feedback by ID
async function deleteFeedbackById(req, res) {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).send();
    }
    res.send(feedback);
  } catch (error) {
    res.status(500).send(error);
  }
}

// Controller for fetching feedbacks by email
async function getFeedbacksByEmail(req, res) {
  const { email } = req.params;

  // Validate email parameter
  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const normalizedEmail = validator.normalizeEmail(email);
    const feedback = await Feedback.find({ email: normalizedEmail });
    res.send(feedback);
  } catch (error) {
    res.status(500).send(error);
  }
}

export {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
  getFeedbacksByEmail,
};
