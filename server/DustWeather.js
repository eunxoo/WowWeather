const axios = require("axios");
require("dotenv").config({ path: "/Users/eunsoo/Desktop/WowWeather/.env" });
const ConvertToAddress = require("./ConvertToAddress");

module.exports = async (req, res) => {
  console.log("DustWeather.js 서버");

  const { lat, lon } = req.body;

  try {
    const addressInfo = await ConvertToAddress(lat, lon);
    const url = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty`;
    const SERVICE_KEY = process.env.OPENAPI_KEY;

    const apiUrl =
      url +
      "?serviceKey=" +
      SERVICE_KEY +
      "&numOfRows=10" +
      "&pageNo=1" +
      "&returnType=" +
      "json" +
      "&sidoName=" +
      addressInfo.region_1depth_name +
      "&ver=1.3";
    axios.get(apiUrl).then((response) => {
      // console.log(response.data);
      // console.log(response.data.response.body);
      console.log("gg" + response.data.response.body.items);
      response.data.response.body.items.forEach((item) => {
        console.log("Item:", item);
      });

      const items = response.data.response.body.items;

      // 각 프로퍼티 값의 빈도를 계산하기 위한 객체
      const frequencies = {};

      // 각 항목의 프로퍼티 값을 분석하여 빈도 계산
      items.forEach((item) => {
        const key = `${item.pm25Grade1h}-${item.pm10Grade1h}`;
        frequencies[key] = (frequencies[key] || 0) + 1;
      });

      // 가장 많이 나온 값 찾기
      let mostFrequent = null;
      let highestFrequency = 0;

      for (const key in frequencies) {
        if (frequencies[key] > highestFrequency) {
          if (mostFrequent !== null || key !== "null-null") {
            mostFrequent = key;
            highestFrequency = frequencies[key];
          }
        }
      }

      if (mostFrequent !== null) {
        // 가장 많이 나온 값의 프로퍼티 값을 추출하여 보내기
        const [pm25Grade1h, pm10Grade1h] = mostFrequent.split("-");
        const result = { pm25Grade1h, pm10Grade1h };
        console.log("Most Frequent:", result);

        res.json(result);
      } else {
        res.json({ pm25Grade1h: null, pm10Grade1h: null });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};