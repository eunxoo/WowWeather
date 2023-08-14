const express = require("express");
const app = express();
const cors = require("cors");
const NowWeather = require("./server/NowWeather");
const TodayWeather = require("./server/TodayWeather");
const PORT = 8000;
require("dotenv").config({ path: "./.env" });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.post("/nowweather", NowWeather);
app.post("/todayweather", TodayWeather);

app.get("/data", function (req, res) {
  const data = {
    lastname: "yang",
    firstname: "eunsoo",
  };
  res.json(data);
  console.log(data);
});

app.listen(PORT, () => {
  console.log(`server running on PORT ${PORT}`);
});
