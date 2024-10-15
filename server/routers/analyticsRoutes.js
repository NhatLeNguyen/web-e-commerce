import express from "express";

import {
  saveAnalyticsData,
  getAnalyticsData,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.post("/", saveAnalyticsData);
router.get("/", getAnalyticsData);

export default router;
