const axios = require("axios");
require("dotenv").config({ path: "../.env" });

// 좌표를 주소로 변환하는 함수
const convertToAddress = async (latitude, longitude) => {
  const KAKAO_KEY = process.env.KAKAO_API_KEY;
  const apiUrl = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`;
  const headers = {
    Authorization: `KakaoAK ${KAKAO_KEY}`,
  };
  //   https://developers.kakao.com/docs/latest/ko/local/dev-guide#coord-to-address-response-body-address
  try {
    const response = await axios.get(apiUrl, { headers });
    const addressInfo = {
      region_1depth_name:
        response.data.documents[0]?.address?.region_1depth_name,
      region_2depth_name:
        response.data.documents[0]?.address?.region_2depth_name,
      region_3depth_name:
        response.data.documents[0]?.address?.region_3depth_name,
    };
    console.log(response.data.documents[0]);
    return addressInfo;
  } catch (error) {
    console.error("Error converting coordinates:", error);
    throw new Error("Error converting coordinates");
  }
};

// /convert 엔드포인트의 핸들러 함수
module.exports = async (req, res) => {
  const { latitude, longitude } = req.query;

  try {
    const address = await convertToAddress(latitude, longitude);
    res.json({ address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error converting coordinates" });
  }
};