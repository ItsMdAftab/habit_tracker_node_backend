const pool = require("../db");

exports.getMonthlyAnalytics = async (req, res) => {
  try {
    const { year, month } = req.params;

    const prayerResult = await pool.query(
      `
      SELECT *
      FROM prayer_records
      WHERE EXTRACT(YEAR FROM prayer_date) = $1
      AND EXTRACT(MONTH FROM prayer_date) = $2
      ORDER BY prayer_date
      `,
      [year, month]
    );

    const gymResult = await pool.query(
      `
      SELECT *
      FROM gym_record
      WHERE EXTRACT(YEAR FROM workout_data) = $1
      AND EXTRACT(MONTH FROM workout_data) = $2
      ORDER BY workout_data
      `,
      [year, month]
    );

    res.json({
      prayers: prayerResult.rows,
      gyms: gymResult.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getMonthlyTrend = async (req, res) => {
  try {
    const { year, month } = req.params;

    const prayerResult = await pool.query(
      `
      SELECT *
      FROM prayer_records
      WHERE EXTRACT(YEAR FROM prayer_date) = $1
      AND EXTRACT(MONTH FROM prayer_date) = $2
      ORDER BY prayer_date
      `,
      [year, month]
    );

    const gymResult = await pool.query(
      `
      SELECT *
      FROM gym_record
      WHERE EXTRACT(YEAR FROM workout_data) = $1
      AND EXTRACT(MONTH FROM workout_data) = $2
      ORDER BY workout_data
      `,
      [year, month]
    );

    res.json({
      prayerTrend: prayerResult.rows,
      gymTrend: gymResult.rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getRecords = async (req, res) => {
  try {
    const prayerResult = await pool.query(
      "SELECT * FROM prayer_records ORDER BY prayer_date"
    );

    const gymResult = await pool.query(
      "SELECT * FROM gym_record ORDER BY workout_data"
    );

    const prayers = prayerResult.rows;
    const gyms = gymResult.rows;

    let highestPrayerStreak = 0;
    let tempPrayerStreak = 0;

    let highestGymStreak = 0;
    let tempGymStreak = 0;

    let totalPrayers = 0;

    prayers.forEach((record) => {
      let completed = 0;

      if (record.fajr) completed++;
      if (record.dhuhr) completed++;
      if (record.asr) completed++;
      if (record.maghrib) completed++;
      if (record.isha) completed++;

      totalPrayers += completed;

      if (completed === 5) {
        tempPrayerStreak++;

        highestPrayerStreak = Math.max(
          highestPrayerStreak,
          tempPrayerStreak
        );
      } else {
        tempPrayerStreak = 0;
      }
    });

    gyms.forEach((record) => {
      if (record.completed) {
        tempGymStreak++;

        highestGymStreak = Math.max(
          highestGymStreak,
          tempGymStreak
        );
      } else {
        tempGymStreak = 0;
      }
    });

    let currentPrayerStreak = 0;

    for (let i = prayers.length - 1; i >= 0; i--) {
      let completed = 0;

      if (prayers[i].fajr) completed++;
      if (prayers[i].dhuhr) completed++;
      if (prayers[i].asr) completed++;
      if (prayers[i].maghrib) completed++;
      if (prayers[i].isha) completed++;

      if (completed === 5) {
        currentPrayerStreak++;
      } else {
        break;
      }
    }

    let currentGymStreak = 0;

    for (let i = gyms.length - 1; i >= 0; i--) {
      if (gyms[i].completed) {
        currentGymStreak++;
      } else {
        break;
      }
    }

    res.json({
      currentPrayerStreak,
      highestPrayerStreak,
      currentGymStreak,
      highestGymStreak,
      totalPrayers,
      totalGymDays: gyms.filter(
        (gym) => gym.completed
      ).length,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message,
    });
  }
};