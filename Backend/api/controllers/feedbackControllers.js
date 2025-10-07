import { Feedback } from "../models/feedbackModel.js";
import escapeHtml from "escape-html";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import validator from "validator";
import mongoSanitize from "mongo-sanitize";

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
    // Sanitize the entire request body
    const sanitizedBody = mongoSanitize(req.body);
    const feedbackData = Array.isArray(sanitizedBody)
      ? sanitizedBody
      : [sanitizedBody];
    const createdFeedbacks = [];

    for (const data of feedbackData) {
      // Whitelist and sanitize input data
      const sanitizedData = {
        firstName: validator.escape(String(data.firstName || "")).trim(),
        lastName: validator.escape(String(data.lastName || "")).trim(),
        email: validator.normalizeEmail(String(data.email || "")),
        membershipId: data.membershipId
          ? validator.escape(String(data.membershipId)).trim()
          : null,
        topic: String(data.topic || ""),
        feedback: validator.escape(String(data.feedback || "")).trim(),
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
    // Escape user-submitted fields
    const safeFeedback = {
      ...feedback._doc, // copy all other fields
      comment: escapeHtml(feedback.comment), // escape only user content
    };

    res.send(safeFeedback);
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
    // Sanitize parameters and body
    const feedbackId = mongoSanitize(req.params.id);
    const sanitizedBody = mongoSanitize(req.body);

    // Whitelist and sanitize input data
    const sanitizedData = {};
    if (sanitizedBody.firstName)
      sanitizedData.firstName = validator
        .escape(String(sanitizedBody.firstName))
        .trim();
    if (sanitizedBody.lastName)
      sanitizedData.lastName = validator
        .escape(String(sanitizedBody.lastName))
        .trim();
    if (sanitizedBody.email)
      sanitizedData.email = validator.normalizeEmail(
        String(sanitizedBody.email)
      );
    if (sanitizedBody.membershipId)
      sanitizedData.membershipId = validator
        .escape(String(sanitizedBody.membershipId))
        .trim();
    if (sanitizedBody.topic) sanitizedData.topic = String(sanitizedBody.topic);
    if (sanitizedBody.feedback)
      sanitizedData.feedback = validator
        .escape(String(sanitizedBody.feedback))
        .trim();

    const feedback = await Feedback.findByIdAndUpdate(
      String(feedbackId),
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
  // Sanitize parameters
  const sanitizedParams = mongoSanitize(req.params);
  const { email } = sanitizedParams;

  // Validate email parameter
  if (!validator.isEmail(String(email))) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  try {
    const normalizedEmail = validator.normalizeEmail(String(email));
    // Whitelist query fields - only allow email
    const query = { email: normalizedEmail };
    const feedbacks = await Feedback.find(query);

    // Escape user-submitted fields (e.g., comment)
    const safeFeedbacks = feedbacks.map(fb => ({
      ...fb._doc, // copy other fields
      comment: escapeHtml(fb.comment) // escape HTML in comment
    }));

    res.status(200).json(safeFeedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks by email:", error);
    res.status(500).json({ message: "Server error" });
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
