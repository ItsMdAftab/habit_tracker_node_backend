const express = require("express");

const router = express.Router();

const {

  saveQuranRecord,
  getTodayQuran,
  getQuranAnalytics,
  getQuranTrend,
  getSurahProgress

} = require("../controllers/quranController");

router.post(
  "/saveRecord",
  saveQuranRecord
);

router.get(
  "/today",
  getTodayQuran
);

router.get(
  "/analytics",
  getQuranAnalytics
);

router.get(
  "/trend/:year/:month",
  getQuranTrend
);

router.get(
  "/progress",
  getSurahProgress
);

module.exports = router;