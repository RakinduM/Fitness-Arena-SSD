import { Carts } from "../models/cartModel.js";
import { validationResult } from "express-validator";
import validator from "validator";
import mongoSanitize from "mongo-sanitize";

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
    // Sanitize the entire request body
    const sanitizedBody = mongoSanitize(req.body);
    const { menuItemId, quantity, email } = sanitizedBody;

    // Whitelist and sanitize input data
    const sanitizedData = {
      menuItemId: String(menuItemId),
      quantity: parseInt(quantity),
      email: validator.normalizeEmail(String(email)),
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
  // Sanitize parameters
  const sanitizedParams = mongoSanitize(req.params);
  const { email } = sanitizedParams;

  // Validate email parameter
  if (!validator.isEmail(String(email))) {
    return res.status(400).json({ error: "Invalid email format" });
  }

  try {
    const normalizedEmail = validator.normalizeEmail(String(email));
    // Whitelist query fields - only allow email
    const query = { email: normalizedEmail };
    const carts = await Carts.find(query).populate("menuItemId");
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
  // Sanitize parameters
  const sanitizedParams = mongoSanitize(req.params);
  const menuItemId = String(sanitizedParams.id);

  try {
    // Whitelist query fields - only allow menuItemId
    const query = { menuItemId: menuItemId };
    const cartItem = await Carts.findOne(query);
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

  // Sanitize parameters and body
  const itemId = mongoSanitize(req.params.id);
  const sanitizedBody = mongoSanitize(req.body);

  try {
    // Whitelist and sanitize input data
    const sanitizedData = {};
    if (sanitizedBody.menuItemId)
      sanitizedData.menuItemId = String(sanitizedBody.menuItemId);
    if (sanitizedBody.quantity)
      sanitizedData.quantity = parseInt(sanitizedBody.quantity);
    if (sanitizedBody.email)
      sanitizedData.email = validator.normalizeEmail(
        String(sanitizedBody.email)
      );

    const result = await Carts.findByIdAndUpdate(
      String(itemId),
      sanitizedData,
      {
        new: true,
      }
    );
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
