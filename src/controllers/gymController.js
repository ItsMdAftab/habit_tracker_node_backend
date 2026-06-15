const pool = require("../db");

exports.saveGymRecord = async (req, res) => {
  try {
    const {
      completed,
      workoutTitle,
      workoutData,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO gym_record
      (completed,workout_title,workout_data)
      VALUES($1,$2,$3)
      RETURNING *`,
      [completed, workoutTitle, workoutData]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};

exports.getGymRecord = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM gym_record ORDER BY workout_data"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json(error.message);
  }
};