import express from "express";
import {
  createCartItem,
  getMyCarts,
  getCartItemById,
  updateCartItemById,
  deleteCartItemById,
} from "../controllers/cartController.js";
import requireAuth from "../Middleware/requireAuth.js";

const router = express.Router();

// Apply auth middleware to all cart routes
router.use(requireAuth);

router.post("/", createCartItem);
router.get("/", getMyCarts);
router.get("/:id", getCartItemById);
router.put("/:id", updateCartItemById);
router.delete("/:id", deleteCartItemById);

export default router;
