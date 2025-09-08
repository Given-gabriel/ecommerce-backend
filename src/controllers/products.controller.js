import cloudinary from "../config/cloudinary.js";
import Product from "../models/products.model.js";
import asyncHandler from "express-async-handler";

////////create product///////////////////////
export const createProduct = asyncHandler(async (req, res) => {
  const { title, description, price, stock, category } = req.body;
  const images = req.file.map((file) => ({
    url: file.path,
    publicId: file.filename,
  }));
  const product = new Product({
    title,
    description,
    price,
    stock,
    category,
    images,
  });
  await product.save();
  res.status(201).json(product);
});

//////////get all products////////////////////////
export const getProducts = asyncHandler(async (req, res) => {
  const { category, page = 1, limit = 10 } = req.query;
  const filter = category ? { category } : {};

  const products = await Product.find(filter)
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Product.countDocuments(filter);

  res.json({
    products,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    },
  });
});

/////////get product by ID//////////////////////////
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

////////////update product/////////////////////////
export const updateProduct = asyncHandler(async (req, res) => {
  const { title, description, price, stock, category } = req.body;
  const product = Product.findById(req.params.id);

  if (!product) return res.status(404).json({ error: "Product not found" });

  //update fields
  if (title) product.title = title;
  if (description) product.description = description;
  if (price) product.price = price;
  if (stock) product.stock = stock;
  if (category) product.category = category;

  //replace image if new one is uploaded
  if (req.files && req.files.length > 0) {
    //delete old image from cloudinary
    for (let img of product.images) {
      await cloudinary.uploader.destroy(img.publicId);
    }

    //save the new image
    product.images = req.files.map((file) => ({
      url: file.path,
      publicId: file.filename,
    }));
  }

  await product.save();
  res.json(product);
});

/////////////////delete product //////////////////
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  //delete all images from cloudinary
  for (let img of product.images) {
    await cloudinary.uploader.destroy(img.publicId);
  }

  //remove product from database
  await product.deleteOne();

  res.json({ message: "Product deleted successfully!" });
});
