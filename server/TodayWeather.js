const { toXY } = require("./XyConvert");
const axios = require("axios");
require("dotenv").config({ path: "../.env" });

module.exports = async (req, res) => {
  console.log("TodayWeather.js 서버");

  const getYesterdayDate = () => {
    let yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    let yyyy = yesterday.getFullYear().toString();
    let mm = yesterday.getMonth() + 1;
    mm = mm < 10 ? "0" + mm.toString() : mm.toString();
    let dd = yesterday.getDate();
    dd = dd < 10 ? "0" + dd.toString() : dd.toString();
    return yyyy + mm + dd;
  };

  const { lat, lon } = req.body;
  const toXYconvert = toXY(lat, lon);

  const url = `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst`;
  const SERVICE_KEY = process.env.OPENAPI_KEY;
  console.log(req.body);
  const apiUrl =
    url +
    "?serviceKey=" +
    SERVICE_KEY +
    "&numOfRows=314" +
    "&pageNo=1" +
    "&dataType=" +
    "json" +
    "&base_date=" +
    getYesterdayDate() +
    "&base_time=" +
    "2300" +
    "&nx=" +
    toXYconvert.x +
    "&ny=" +
    toXYconvert.y;
  axios
    .get(apiUrl)
    .then((response) => {
      console.log(response.data);
      console.log(response.data.response.body);
      console.log(response.data.response.body.items.item);
      res.send(response.data.response.body.items.item);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Internal Server Error");
    });
};
