import asyncHandler from "express-async-handler";
import Cart from "../models/cart.model.js";
import Product from "../models/products.model.js";

//////// GET api/cart //////////////////////////////
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "title price images stock category"
  );
  if (!cart) {
    return res.json({ items: [] });
  }
  res.json(cart);
});

////////// add to cart ///////////////////////////
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex > -1) {
    //product already in cart -> update quantity
    cart.items[itemIndex].quantity += quantity;
  } else {
    // new product
    cart.items.push({ product: productId, quantity });
  }

  await cart.save();
  res.json(cart);
});

////////// update quantity //////////////////////////
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === re.params.productId
  );

  if (itemIndex === -1) {
    res.status(404);
    throw new Error("Product not in cart");
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  res.json(cart);
});

/////////// DELETE /api/cart/:productId ////////////
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== req.params.productId
  );

  await cart.save();

  res.json(cart);
});
