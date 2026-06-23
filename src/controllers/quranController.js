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