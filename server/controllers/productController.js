import Product from "../models/products.js";

// Create a new product
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
      images,
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

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
