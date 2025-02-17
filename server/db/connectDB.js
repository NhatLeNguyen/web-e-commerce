import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  const URI = process.env.MONGO_URI;
  try {
    await mongoose.connect(URI);
    console.log("Connect DB success");
  } catch (err) {
    console.log("DB connection error: ", err);
    process.exit(1);
  }
};

export default connectDB;
