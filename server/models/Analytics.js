import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema({
  date: { type: String, required: true },
  visitors: { type: Number, required: true },
  pageViews: { type: Number, required: true },
});

const Analytics = mongoose.model("Analytics", analyticsSchema);

export default Analytics;
