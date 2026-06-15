const pool = require("../db");

exports.getOverview = async (req, res) => {
  try {
    const prayerResult = await pool.query(
      "SELECT * FROM prayer_records ORDER BY prayer_date"
    );

    const gymResult = await pool.query(
      "SELECT * FROM gym_record ORDER BY workout_data"
    );

    const prayers = prayerResult.rows;
    const gyms = gymResult.rows;

    let totalPrayers = 0;
    let currentStreak = 0;
    let highestStreak = 0;
    let tempStreak = 0;

    let totalGymDays = 0;
    let currentGymStreak = 0;
    let highestGymStreak = 0;
    let tempGymStreak = 0;

    // Prayer Calculations

    prayers.forEach((record) => {
      let completed = 0;

      if (record.fajr) completed++;
      if (record.dhuhr) completed++;
      if (record.asr) completed++;
      if (record.maghrib) completed++;
      if (record.isha) completed++;

      totalPrayers += completed;

      if (completed === 5) {
        tempStreak++;

        if (tempStreak > highestStreak) {
          highestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
    });

    for (let i = prayers.length - 1; i >= 0; i--) {
      const record = prayers[i];

      const fullDay =
        record.fajr &&
        record.dhuhr &&
        record.asr &&
        record.maghrib &&
        record.isha;

      if (fullDay) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Gym Calculations

    gyms.forEach((record) => {
      if (record.completed) {
        totalGymDays++;

        tempGymStreak++;

        if (tempGymStreak > highestGymStreak) {
          highestGymStreak = tempGymStreak;
        }
      } else {
        tempGymStreak = 0;
      }
    });

    for (let i = gyms.length - 1; i >= 0; i--) {
      if (gyms[i].completed) {
        currentGymStreak++;
      } else {
        break;
      }
    }

    res.json({
      totalPrayers,
      currentStreak,
      highestStreak,
      totalGymDays,
      currentGymStreak,
      highestGymStreak,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json(error.message);
  }
};