import express from "express";
import {
  createCartItem,
  getCartsByEmail,
  getCartByMenuItemId,
  getAllCartItems,
  getCartItemById,
  updateCartItemById,
  deleteCartItemById,
} from "../controllers/cartController.js";
import {
  validateCart,
  validateCartUpdate,
  validateObjectId,
  validateEmail,
} from "../Middleware/validationMiddleware.js";

const router = express.Router();

// Routes for cart items
router.post("/", validateCart, createCartItem); // Create a new cart item

router.get("/", getAllCartItems); // Get all cart items
router.get("/item/:id", validateObjectId, getCartItemById); // Get a cart item by ID
router.get("/email/:email", validateEmail, getCartsByEmail);
router.get("/menu/:id", validateObjectId, getCartByMenuItemId); // Get a cart item by menuItemId
router.put("/:id", validateObjectId, validateCartUpdate, updateCartItemById); // Update a cart item by ID
router.delete("/:id", validateObjectId, deleteCartItemById); // Delete a cart item by ID

export default router;
