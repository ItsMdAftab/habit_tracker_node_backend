const pool = require("../db");

exports.saveQuranRecord =
async (req,res)=>{

try{

const {

readingDate,
surahNumber,
surahName,
minutesSpent,
perfectionRate,
meaningLearned,
memorized

} = req.body;

const result =
await pool.query(

`
INSERT INTO quran_records
(
reading_date,
surah_number,
surah_name,
minutes_spent,
perfection_rate,
meaning_learned,
memorized
)
VALUES
($1,$2,$3,$4,$5,$6,$7)
RETURNING *
`,

[
readingDate,
surahNumber,
surahName,
minutesSpent,
perfectionRate,
meaningLearned,
memorized
]

);

res.json(
result.rows[0]
);

}

catch(error){

console.error(error);

res.status(500).json({
error:error.message
});

}

};
exports.getTodayQuran =
async (req,res)=>{

try{

const result =
await pool.query(

`
SELECT *
FROM quran_records
ORDER BY reading_date DESC
LIMIT 1
`

);

res.json(
result.rows[0]
);

}

catch(error){

console.error(error);

res.status(500).json({
error:error.message
});

}

};exports.getQuranAnalytics =
async (req,res)=>{

  try{

    res.json({

      currentStreak: 0,

      highestStreak: 0,

      monthMinutes: 0,

      yearMinutes: 0,

      topSurahMonth: "No Data",

      topSurahYear: "No Data"

    });

  }

  catch(error){

    res.status(500).json({
      error:error.message
    });

  }

};

exports.getQuranTrend =
async (req,res)=>{

  try{

    res.json([]);

  }

  catch(error){

    res.status(500).json({
      error:error.message
    });

  }

};

exports.getSurahProgress =
async (req,res)=>{

  try{

    res.json([]);

  }

  catch(error){

    res.status(500).json({
      error:error.message
    });

  }

};