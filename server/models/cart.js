import mongoose from "mongoose";

const cartItemSchema = mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  size: { type: String },
  imageUrl: { type: String, required: true },
});

const cartSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
});

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
