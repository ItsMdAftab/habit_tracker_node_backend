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

`INSERT INTO quran_records
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
RETURNING *`,

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

`SELECT *
FROM quran_records
ORDER BY reading_date DESC
LIMIT 1`

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

exports.getQuranAnalytics =
async (req,res)=>{

try{

const result =
await pool.query(
`SELECT *
FROM quran_records
ORDER BY reading_date`
);

const records =
result.rows;

let totalMinutes = 0;

records.forEach(record=>{

totalMinutes +=
record.minutes_spent;

});

const topSurahMap =
records.reduce(

(acc,current)=>{

acc[current.surah_name] =
(
acc[current.surah_name]
|| 0
)
+
current.minutes_spent;

return acc;

},

{}

);

let topSurah =
"No Data";

let maxMinutes = 0;

for(
const surah
in topSurahMap
){

if(
topSurahMap[surah]

>

maxMinutes
){

maxMinutes =
topSurahMap[surah];

topSurah =
surah;

}

}

res.json({

currentStreak:
records.length,

highestStreak:
records.length,

totalMinutes,

totalHours:
(
totalMinutes/60
).toFixed(1),

topSurah

});

}

catch(error){

console.error(error);

res.status(500).json({
error:error.message
});

}

};

exports.getQuranTrend =
async (req,res)=>{

try{

const {
year,
month
} = req.params;

const result =
await pool.query(

`SELECT
reading_date,
minutes_spent
FROM quran_records
WHERE
EXTRACT(YEAR FROM reading_date)=$1
AND
EXTRACT(MONTH FROM reading_date)=$2
ORDER BY reading_date`,

[
year,
month
]

);

const trend =
result.rows.map(
record=>({

date:
record.reading_date
.toISOString()
.split("T")[0],

minutes:
record.minutes_spent

})
);

res.json(
trend
);

}

catch(error){

console.error(error);

res.status(500).json({
error:error.message
});

}

};

exports.getSurahProgress =
async (req,res)=>{

try{

const result =
await pool.query(

`
SELECT

surah_number,
surah_name,

MAX(perfection_rate)
AS perfection_rate,

BOOL_OR(meaning_learned)
AS meaning_learned,

BOOL_OR(memorized)
AS memorized

FROM quran_records

GROUP BY

surah_number,
surah_name

ORDER BY

surah_number
`

);

res.json(
result.rows
);

}

catch(error){

console.error(error);

res.status(500).json({
error:error.message
});

}

};
