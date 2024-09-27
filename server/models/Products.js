import mongoose from "mongoose";

const racketSchema = new mongoose.Schema({
  flexibility: { type: String, required: true },
  frameMaterial: { type: String, required: true },
  shaftMaterial: { type: String, required: true },
  weight: { type: String, required: true },
  gripSize: { type: String, required: true },
  maxTension: { type: String, required: true },
  balancePoint: { type: String, required: true },
  color: { type: String, required: true },
  madeIn: { type: String, required: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: [
      "racket",
      "shoes",
      "shorts",
      "shirt",
      "skirt",
      "racket-bag",
      "backpack",
      "accessory",
    ],
  },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  images: { type: [String], required: true },
  racketDetails: racketSchema,
  size: { type: String },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
