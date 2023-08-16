const { toXY } = require("./XyConvert");
const axios = require("axios");
require("dotenv").config({ path: "/Users/eunsoo/Desktop/WowWeather/.env" });

module.exports = async (req, res) => {
  console.log("NowWeather.js 서버");

  const getTodayDate = () => {
    let today = new Date(Date.now() - 45 * 60 * 1000);
    let yyyy = today.getFullYear().toString();
    let mm = today.getMonth() + 1;
    mm = mm < 10 ? "0" + mm.toString() : mm.toString();
    let dd = today.getDate();
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
  const SERVICE_KEY = process.env.OPENAPI_KEY;
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
    getTodayDate() +
    "&base_time=" +
    getBaseTime() +
    "&nx=" +
    toXYconvert.x +
    "&ny=" +
    toXYconvert.y;
  axios
    .get(apiUrl)
    .then((response) => {
      const selectedFields = fields || ["T1H", "SKY", "PTY"]; // 기본 필드 설정
      const selectedItems = response.data.response.body.items.item.filter(
        (item) => selectedFields.includes(item.category)
      );
      // console.log(response.data);
      // console.log(response.data.response.body);
      // console.log(response.data.response.body.items.item);
      // res.send(response.data.response.body.items.item);
      res.send(selectedItems);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
};
