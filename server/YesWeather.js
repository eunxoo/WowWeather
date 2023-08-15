const { toXY } = require("./XyConvert");
const axios = require("axios");
require("dotenv").config({ path: "../.env" });

module.exports = async (req, res) => {
  console.log("NowWeather.js 서버");

  const getYesterdayDate = () => {
    let yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000 - 45 * 60 * 1000);
    let yyyy = yesterday.getFullYear().toString();
    let mm = yesterday.getMonth() + 1;
    mm = mm < 10 ? "0" + mm.toString() : mm.toString();
    let dd = yesterday.getDate();
    dd = dd < 10 ? "0" + dd.toString() : dd.toString();
    return yyyy + mm + dd;
  };

  //초단기예보시간 - 예보시간은 각 30분, api제공시간은 45분
  const getBaseTime = () => {
    let hourDate = new Date(Date.now() - 45 * 60 * 1000);
    let hour = hourDate.getHours();
    hour = hour >= 10 ? hour : "0" + hour;
    return hour + "" + "30";
  };

  const { lat, lon, fields } = req.body;
  const toXYconvert = toXY(lat, lon);

  const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst`;
  const SERVICE_KEY = process.env.W_OPENAPI_KEY;
  console.log(req.body);
  const apiUrl =
    url +
    "?serviceKey=" +
    SERVICE_KEY +
    "&numOfRows=60" +
    "&pageNo=1" +
    "&dataType=" +
    "json" +
    "&base_date=" +
    getYesterdayDate() +
    "&base_time=" +
    getBaseTime() +
    "&nx=" +
    toXYconvert.x +
    "&ny=" +
    toXYconvert.y;
  axios
    .get(apiUrl)
    .then((response) => {
      const selectedFields = fields || ["T1H"]; // 기본 필드 설정
      const selectedItems = response.data.response.body.items.item.filter(
        (item) => selectedFields.includes(item.category)
      );

      res.send(selectedItems);
      console.log(response.data);
      console.log(response.data.response.body);
      console.log(response.data.response.body.items.item);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
};