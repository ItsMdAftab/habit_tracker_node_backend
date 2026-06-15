const express = require("express");

const router = express.Router();

const {
  getMonthlyAnalytics,
  getMonthlyTrend,
  getRecords
} = require("../controllers/analyticsController");

router.get(
  "/month/:year/:month",
  getMonthlyAnalytics
);

router.get(
  "/monthly-trend/:year/:month",
  getMonthlyTrend
);

router.get(
  "/records",
  getRecords
);

module.exports = router;