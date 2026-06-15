const express = require("express");

const router = express.Router();

const {
  getMonthlyAnalytics
} = require("../controllers/analyticsController");

router.get(
  "/month/:year/:month",
  getMonthlyAnalytics
);

module.exports = router;