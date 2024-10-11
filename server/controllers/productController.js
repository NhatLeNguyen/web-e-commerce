import Product from "../models/Products.js";
import mongoose from "mongoose";

export const createProduct = async (req, res) => {
  const { name, brand, category, price, stock, racketDetails, size, images } =
    req.body;

  try {
    const newProduct = new Product({
      name,
      brand,
      category,
      price,
      stock,
      images, // Assuming images are already in base64 format
      racketDetails: category === "racket" ? racketDetails : undefined,
      size: category !== "racket" ? size : undefined,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
// Get all products or products by category
export const getProducts = async (req, res) => {
  const category = req.query.category;
  try {
    const products = category
      ? await Product.find({ category })
      : await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
// Update product by ID
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, brand, category, price, stock, racketDetails, size, images } =
    req.body;

  try {
    // Convert images to base64
    const base64Images = images.map((image) => {
      if (image.startsWith("data:image")) {
        return image;
      } else {
        return image;
      }
    });

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        brand,
        category,
        price,
        stock,
        images: base64Images,
        racketDetails: category === "racket" ? racketDetails : undefined,
        size: category !== "racket" ? size : undefined,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Delete product by ID
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
