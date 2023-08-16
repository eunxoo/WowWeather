const axios = require("axios");
require("dotenv").config({ path: "/Users/eunsoo/Desktop/WowWeather/.env" });
const ConvertToAddress = require("./ConvertToAddress");

// /convert 엔드포인트의 핸들러 함수
module.exports = async (req, res) => {
  const { latitude, longitude } = req.query;

  try {
    const address = await ConvertToAddress(latitude, longitude);
    res.json({ address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error converting coordinates" });
  }
};
