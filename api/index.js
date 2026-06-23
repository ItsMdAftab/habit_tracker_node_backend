require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://habit-tracker-frontend-x1li.onrender.com",
      "https://your-frontend.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// Prayer Routes
app.use(
  "/prayers",
  require("../src/routes/prayerRoutes")
);

// Gym Routes
app.use(
  "/Gym",
  require("../src/routes/gymRoutes")
);

// Overview Routes
app.use(
  "/overview",
  require("../src/routes/overviewRoutes")
);

// Analytics Routes
app.use(
  "/analytics",
  require("../src/routes/analyticsRoutes")
);

// Quran Routes
app.use(
  "/quran",
  require("../src/routes/quranRoutes")
);

// Home Route
app.get("/", (req, res) => {
  res.send("Habit Tracker Backend Running");
});

// Local Development
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

module.exports = app;