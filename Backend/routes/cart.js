import express from "express";
import { Carts } from "../models/cartModel.js";
import mongoSanitize from "mongo-sanitize";

const router = express.Router();

// post a cart when add-to-cart btn clicked
router.post("/", async (req, res) => {
  try {
    // Sanitize the entire request body
    const sanitizedBody = mongoSanitize(req.body);
    const { menuItemId, name, image, price, quantity, email } = sanitizedBody;

    // Additional validation
    if (!menuItemId || !email) {
      return res
        .status(400)
        .json({ message: "Menu item ID and email are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if existing menu item
    const existingCartItem = await Carts.findOne({
      email: String(email),
      menuItemId: String(menuItemId),
    });

    if (existingCartItem) {
      return res
        .status(400)
        .json({ message: "Product already exists in the cart!" });
    }

    const cartItem = await Carts.create({
      menuItemId: String(menuItemId),
      name: String(name || ""),
      image: String(image || ""),
      price: parseFloat(price) || 0,
      quantity: parseInt(quantity) || 1,
      email: String(email),
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get carts using email
router.get("/", async (req, res) => {
  try {
    // Sanitize query parameters
    const sanitizedQuery = mongoSanitize(req.query);
    const { email } = sanitizedQuery;

    if (!email) {
      return res.status(400).json({ message: "Email parameter is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Whitelist query fields - only allow email
    const query = { email: String(email) };
    const result = await Carts.find(query).exec();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get specific carts
router.get("/:id", async (req, res) => {
  const cartId = req.params.id;
  try {
    const cartItem = await Carts.findById(cartId);
    res.status(200).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//delete items from cart
router.delete("/:id", async (req, res) => {
  const cartId = req.params.id;
  try {
    const deletedCart = await Carts.findByIdAndDelete(cartId);
    if (!deletedCart) {
      return res.status(401).json({ message: "Cart Items not found!" });
    }
    res.status(200).json({ message: "Cart Item Deleted Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update carts quantity
router.put("/:id", async (req, res) => {
  try {
    // Sanitize parameters and body
    const cartId = mongoSanitize(req.params.id);
    const sanitizedBody = mongoSanitize(req.body);
    const { menuItemId, name, image, price, quantity, email } = sanitizedBody;

    // Validate ObjectId format for cartId
    if (!/^[0-9a-fA-F]{24}$/.test(cartId)) {
      return res.status(400).json({ message: "Invalid cart ID format" });
    }

    // Whitelist and validate update fields
    const updateFields = {};
    if (menuItemId) updateFields.menuItemId = String(menuItemId);
    if (name) updateFields.name = String(name);
    if (image) updateFields.image = String(image);
    if (price !== undefined) updateFields.price = parseFloat(price);
    if (quantity !== undefined) updateFields.quantity = parseInt(quantity);
    if (email) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      updateFields.email = String(email);
    }

    const updatedCart = await Carts.findByIdAndUpdate(cartId, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart Item not found" });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
