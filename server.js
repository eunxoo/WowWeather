const express = require("express");
const app = express();
const cors = require("cors");
const weather = require("./server/weather");
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

app.post("/todayweather", weather);

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
