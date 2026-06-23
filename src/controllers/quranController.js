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

};
exports.getQuranAnalytics =
async (req,res)=>{

try{

const result =
await pool.query(
`
SELECT *
FROM quran_records
ORDER BY reading_date
`
);

const records =
result.rows;

let highestStreak = 0;
let tempStreak = 0;

let totalMinutes =
0;

records.forEach(record=>{

totalMinutes +=
record.minutes_spent;

tempStreak++;

highestStreak =
Math.max(
highestStreak,
tempStreak
);

});

let currentStreak = 0;

for(
let i =
records.length-1;
i>=0;
i--
){

currentStreak++;

}

const topSurah =
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

let topSurahName =
"No Data";

let maxMinutes =
0;

for(
const surah
in topSurah
){

if(
topSurah[surah]
>
maxMinutes
){

maxMinutes =
topSurah[surah];

topSurahName =
surah;

}

}

res.json({

currentStreak,

highestStreak,

totalMinutes,

totalHours:
(
totalMinutes/60
).toFixed(1),

topSurah:
topSurahName

});

}

catch(error){

res.status(500).json({
error:error.message
});

}

};