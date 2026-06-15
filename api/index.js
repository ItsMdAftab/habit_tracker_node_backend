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
      "https://your-frontend.vercel.app" // replace later
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

app.use(
  "/prayers",
  require("../src/routes/prayerRoutes")
);

app.use(
  "/Gym",
  require("../src/routes/gymRoutes")
);

app.use(
  "/overview",
  require("../src/routes/overviewRoutes")
);

app.get("/", (req, res) => {
  res.send("Habit Tracker Backend Running");
});

if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}
app.use(
  "/analytics",
  require("../src/routes/analyticsRoutes")
);
module.exports = app;