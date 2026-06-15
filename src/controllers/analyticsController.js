const pool = require("../db");

exports.getMonthlyAnalytics = async (req, res) => {
  try {

    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

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

    const prayers = prayerResult.rows;
    const gyms = gymResult.rows;

    const totalDays = prayers.length || 1;

    let fajrCount = 0;
    let dhuhrCount = 0;
    let asrCount = 0;
    let maghribCount = 0;
    let ishaCount = 0;

    let totalPrayers = 0;

    prayers.forEach((record) => {

      if(record.fajr) {
        fajrCount++;
        totalPrayers++;
      }

      if(record.dhuhr) {
        dhuhrCount++;
        totalPrayers++;
      }

      if(record.asr) {
        asrCount++;
        totalPrayers++;
      }

      if(record.maghrib) {
        maghribCount++;
        totalPrayers++;
      }

      if(record.isha) {
        ishaCount++;
        totalPrayers++;
      }

    });

    const possiblePrayers =
      totalDays * 5;

    const prayerCompletionRate =
      possiblePrayers > 0
        ? Number(
            (
              totalPrayers /
              possiblePrayers *
              100
            ).toFixed(1)
          )
        : 0;

    const gymDays =
      gyms.filter(
        gym => gym.completed
      ).length;

    const gymCompletionRate =
      gyms.length > 0
        ? Number(
            (
              gymDays /
              gyms.length *
              100
            ).toFixed(1)
          )
        : 0;

    res.json({

      year,
      month,

      prayerCompletionRate,

      gymCompletionRate,

      fajrRate:
        Number(
          (fajrCount / totalDays * 100)
          .toFixed(1)
        ),

      dhuhrRate:
        Number(
          (dhuhrCount / totalDays * 100)
          .toFixed(1)
        ),

      asrRate:
        Number(
          (asrCount / totalDays * 100)
          .toFixed(1)
        ),

      maghribRate:
        Number(
          (maghribCount / totalDays * 100)
          .toFixed(1)
        ),

      ishaRate:
        Number(
          (ishaCount / totalDays * 100)
          .toFixed(1)
        )

    });

  } catch(error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};
exports.getMonthlyTrend = async (req, res) => {
  try {

    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

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

    const data =
      prayerResult.rows.map(record => {

        let count = 0;

        if(record.fajr) count++;
        if(record.dhuhr) count++;
        if(record.asr) count++;
        if(record.maghrib) count++;
        if(record.isha) count++;

        return {
          date: record.prayer_date,
          prayers: count
        };

      });

    res.json(data);

  } catch(error) {

    res.status(500).json({
      error: error.message
    });

  }
};
exports.getRecords = async (req, res) => {

  try {

    const prayerResult =
      await pool.query(
        "SELECT * FROM prayer_records ORDER BY prayer_date"
      );

    const gymResult =
      await pool.query(
        "SELECT * FROM gym_record ORDER BY workout_data"
      );

    const prayers =
      prayerResult.rows;

    const gyms =
      gymResult.rows;

    let highestPrayerStreak = 0;
    let tempPrayerStreak = 0;

    let highestGymStreak = 0;
    let tempGymStreak = 0;

    let totalPrayers = 0;

    prayers.forEach(record => {

      let completed = 0;

      if(record.fajr) completed++;
      if(record.dhuhr) completed++;
      if(record.asr) completed++;
      if(record.maghrib) completed++;
      if(record.isha) completed++;

      totalPrayers += completed;

      const fullDay =
        completed === 5;

      if(fullDay){

        tempPrayerStreak++;

        highestPrayerStreak =
          Math.max(
            highestPrayerStreak,
            tempPrayerStreak
          );

      }

      else{

        tempPrayerStreak = 0;

      }

    });

    gyms.forEach(record => {

      if(record.completed){

        tempGymStreak++;

        highestGymStreak =
          Math.max(
            highestGymStreak,
            tempGymStreak
          );

      }

      else{

        tempGymStreak = 0;

      }

    });

    res.json({

      highestPrayerStreak,

      highestGymStreak,

      totalPrayers,

      totalGymDays:
        gyms.filter(
          gym => gym.completed
        ).length

    });

  }

  catch(error){

    res.status(500).json({
      error:error.message
    });

  }

};