import { Carts } from "../models/cartModel.js";
import { validationResult } from "express-validator";
import validator from "validator";

// Controller function to create a new cart item
export const createCartItem = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  try {
    const { menuItemId, quantity, email } = req.body;

    // Sanitize input data
    const sanitizedData = {
      menuItemId,
      quantity: parseInt(quantity),
      email: validator.normalizeEmail(email),
    };

    const newCartItem = new Carts(sanitizedData);
    const savedCartItem = await newCartItem.save();
    res.status(201).json(savedCartItem);
  } catch (error) {
    console.error("Error creating cart item:", error);
    res.status(500).json({ error: "Error creating cart item" });
  }
};

// Controller function to get carts by email
export const getCartsByEmail = async (req, res) => {
  const { email } = req.params;

  // Validate email parameter
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const normalizedEmail = validator.normalizeEmail(email);
    const carts = await Carts.find({ email: normalizedEmail }).populate(
      "menuItemId"
    );
    res.json(carts);
  } catch (error) {
    console.error("Error getting carts by email:", error);
    res.status(500).json({ error: "Error getting carts by email" });
  }
};

// Controller function to retrieve all cart items
export const getAllCartItems = async (req, res) => {
  try {
    const cartItems = await Carts.find().populate("menuItemId");
    res.json(cartItems);
  } catch (error) {
    console.error("Error reading cart items:", error);
    res.status(500).json({ error: "Error reading cart items" });
  }
};

// Controller function to get a cart item by its ID
export const getCartItemById = async (req, res) => {
  const itemId = req.params.id;
  try {
    const cartItem = await Carts.findById(itemId).populate("menuItemId");
    if (!cartItem) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }
    res.json(cartItem);
  } catch (error) {
    console.error("Error getting cart item:", error);
    res.status(500).json({ error: "Error getting cart item" });
  }
};

// Controller function to get a cart item by menuItemId
export const getCartByMenuItemId = async (req, res) => {
  const menuItemId = req.params.id;
  try {
    const cartItem = await Carts.findOne({ menuItemId });
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    res.json(cartItem);
  } catch (error) {
    console.error("Error getting cart item:", error);
    res.status(500).json({ error: "Error getting cart item" });
  }
};

// Controller function to update a cart item by its ID
export const updateCartItemById = async (req, res) => {
  // Check validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const itemId = req.params.id;
  const updatedCartItem = req.body;

  try {
    // Sanitize input data
    const sanitizedData = {};
    if (updatedCartItem.menuItemId)
      sanitizedData.menuItemId = updatedCartItem.menuItemId;
    if (updatedCartItem.quantity)
      sanitizedData.quantity = parseInt(updatedCartItem.quantity);
    if (updatedCartItem.email)
      sanitizedData.email = validator.normalizeEmail(updatedCartItem.email);

    const result = await Carts.findByIdAndUpdate(itemId, sanitizedData, {
      new: true,
    });
    if (!result) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }
    res.json(result);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Error updating cart item" });
  }
};

// Controller function to delete a cart item by its ID
export const deleteCartItemById = async (req, res) => {
  const cartItemId = req.params.id;
  try {
    const result = await Carts.findByIdAndDelete(cartItemId);
    if (!result) {
      res.status(404).json({ error: "Cart item not found" });
      return;
    }
    res.json(result);
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ error: "Error deleting cart item" });
  }
};
