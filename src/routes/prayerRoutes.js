const express = require("express");
const router = express.Router();

const {
  savePrayerRecord,
  getAllPrayerRecords,
} = require("../controllers/prayerController");

router.post("/savePrayerRecord", savePrayerRecord);

router.get("/getAllPrayerRecords", getAllPrayerRecords);

module.exports = router;