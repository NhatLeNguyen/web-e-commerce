import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    required: true,
    enum: ["guest", "admin"],
    default: "guest",
  },
  avatar: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwmN2B5ZtIWxid1qvHQiEHKisZirAA7fcBDg&s",
  },
});

const User = mongoose.model("User", userSchema);

export default User;
