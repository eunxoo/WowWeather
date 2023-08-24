const express = require("express");
const app = express();
const cors = require("cors");
const NowWeather = require("./server/NowWeather");
const TodayWeather = require("./server/TodayWeather");
const YesWeather = require("./server/YesWeather");
const AddressConvert = require("./server/AddressConvert");
const DustWeather = require("./server/DustWeather");
const TomorrowWeather = require("./server/TomorrowWeather");
const PORT = 8000;

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
app.post("/yesweather", YesWeather);
app.post("/tomorrowweather", TomorrowWeather);
app.get("/convert", AddressConvert);
app.post("/nowdust", DustWeather);

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
