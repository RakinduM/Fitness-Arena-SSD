import { Feedback } from "../models/feedbackModel.js";
import escapeHtml from "escape-html";
import mongoose from "mongoose";
 
// Controller for creating new feedback
async function createFeedback(req, res) {
    try {
      const feedbackData = Array.isArray(req.body) ? req.body : [req.body];
      const createdFeedbacks = [];
 
      for (const data of feedbackData) {
        const feedback = new Feedback(data);
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
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
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

  try {
    const feedbacks = await Feedback.find({ email });

    // Escape user-submitted fields (e.g., comment)
    const safeFeedbacks = feedbacks.map(fb => ({
      ...fb._doc, // copy other fields
      comment: escapeHtml(fb.comment) // escape HTML in comment
    }));

    res.status(200).json(safeFeedbacks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
}


 
export {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
  updateFeedbackById,
  deleteFeedbackById,
  getFeedbacksByEmail
};