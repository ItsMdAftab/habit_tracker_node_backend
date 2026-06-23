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

    const prayers = prayerResult.rows;

    const totalDays = prayers.length;

    if (totalDays === 0) {
      return res.json({
        prayerCompletionRate: 0,
        fajrRate: 0,
        dhuhrRate: 0,
        asrRate: 0,
        maghribRate: 0,
        ishaRate: 0,
        totalDays: 0,
      });
    }

    let fajrCount = 0;
    let dhuhrCount = 0;
    let asrCount = 0;
    let maghribCount = 0;
    let ishaCount = 0;
    let totalCompletedPrayers = 0;

    prayers.forEach((record) => {
      if (record.fajr) {
        fajrCount++;
        totalCompletedPrayers++;
      }

      if (record.dhuhr) {
        dhuhrCount++;
        totalCompletedPrayers++;
      }

      if (record.asr) {
        asrCount++;
        totalCompletedPrayers++;
      }

      if (record.maghrib) {
        maghribCount++;
        totalCompletedPrayers++;
      }

      if (record.isha) {
        ishaCount++;
        totalCompletedPrayers++;
      }
    });

    const totalPossiblePrayers = totalDays * 5;

    res.json({
      prayerCompletionRate: Math.round(
        (totalCompletedPrayers / totalPossiblePrayers) * 100
      ),

      fajrRate: Math.round(
        (fajrCount / totalDays) * 100
      ),

      dhuhrRate: Math.round(
        (dhuhrCount / totalDays) * 100
      ),

      asrRate: Math.round(
        (asrCount / totalDays) * 100
      ),

      maghribRate: Math.round(
        (maghribCount / totalDays) * 100
      ),

      ishaRate: Math.round(
        (ishaCount / totalDays) * 100
      ),

      totalDays,
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