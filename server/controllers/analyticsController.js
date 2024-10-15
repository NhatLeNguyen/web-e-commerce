import Analytics from "../models/Analytics.js";

export const saveAnalyticsData = async (req, res) => {
  const { date, visitors, pageViews } = req.body;
  try {
    const analytics = new Analytics({ date, visitors, pageViews });
    await analytics.save();
    res.status(201).json({ message: "Data saved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to save data", error });
  }
};

export const getAnalyticsData = async (req, res) => {
  try {
    const data = await Analytics.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve data", error });
  }
};
