const express = require("express");
const router = express.Router();

const {
  saveGymRecord,
  getGymRecord,
} = require("../controllers/gymController");

router.post("/saveGymRecord", saveGymRecord);

router.get("/getGymRecord", getGymRecord);

module.exports = router;