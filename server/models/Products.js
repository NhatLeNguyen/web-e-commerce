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

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  username: { type: String, default: "Anonymous" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Date, default: Date.now },
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
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
