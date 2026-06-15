const pool = require("../db");

exports.savePrayerRecord = async (req, res) => {
  try {
    const {
      fajr,
      dhuhr,
      asr,
      maghrib,
      isha,
      prayerDate,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO prayer_records
      (fajr,dhuhr,asr,maghrib,isha,prayer_date)
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [fajr, dhuhr, asr, maghrib, isha, prayerDate]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

exports.getAllPrayerRecords = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM prayer_records ORDER BY prayer_date"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};