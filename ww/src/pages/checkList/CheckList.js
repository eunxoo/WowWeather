import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { GoChecklist } from "react-icons/go";
import moment from "moment-timezone";
import axios from "axios";
import Recommend from "../../components/checklist/Recommend";
import ItemList from "../../components/checklist/ItemList";

const CheckList = ({ userObj }) => {
  moment.tz.setDefault("Asia/Seoul");
  console.log(moment().hour());
  const nowHours = moment().hour();
  const url =
    "https://port-0-wow-node-express-54ouz2lllulbggn.sel3.cloudtype.app";

  const hours = nowHours;
  const [rain, setRain] = useState("");
  const [dust, setDust] = useState("");
  const [sdust, setSDust] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  console.log(nowHours);
  const [responseW, setResponseW] = useState({
    nowPTY: [],
    todayPTY: [],
    tomorrowPTY: [],
    nowDust: [],
  });

  const fetchData = (apiEndpoint, lat, lon) => {
    return axios({
      url: url + apiEndpoint,
      method: "post",
      data: { lat: lat, lon: lon },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        console.log(`lat : ${lat}, lon : ${lon}`);

        setLatitude(lat);
        setLongitude(lon);

        Promise.all([
          fetchData("/nowweather", lat, lon, ["T1H", "SKY", "PTY"]),
          fetchData("/nowdust", lat, lon),
          fetchData("/todayweather", lat, lon, [
            "TMN",
            "TMX",
            "TMP",
            "SKY",
            "PTY",
          ]),
          fetchData("/tomorrowweather", lat, lon, ["TMP", "SKY", "PTY"]),
        ])
          .then(
            ([
              nowWeatherRes,
              nowDustRes,
              todayWeatherRes,
              tomorrowWeatherRes,
            ]) => {
              const nowPTY = nowWeatherRes.data.find(
                (item) => item.category === "PTY"
              );
              if (nowPTY) {
                setRain(nowPTY.fcstValue);
              }
              console.log(todayWeatherRes);
              console.log(tomorrowWeatherRes);
              console.log(nowWeatherRes);
              console.log(nowDustRes);

              const pm25Grade1h = nowDustRes.data.pm25Grade1h;
              const pm10Grade1h = nowDustRes.data.pm10Grade1h;
              setDust(pm10Grade1h || "-"); // 만약 null이면 "-"로 설정
              setSDust(pm25Grade1h || "-");
              // if (dust >= 3 || sdust >= 3) {
              //   setRecommend((prevRecommend) =>
              //     !prevRecommend.includes("마스크")
              //       ? [...prevRecommend, "마스크"]
              //       : prevRecommend
              //   );
              // }
              console.log(dust);
              // if (outingTimes.outing1Time && outingTimes.outing2Time) {
              //   const outingStartTime = parseInt(
              //     formatTimeToFixedHours(outingTimes.outing1Time)
              //   );
              //   const outingEndTime = parseInt(
              //     formatTimeToFixedHours(outingTimes.outing2Time)
              //   );

              const todayPTY = todayWeatherRes.data.filter(
                (item) => item.category === "PTY"
              );

              const tomorrowPTY = tomorrowWeatherRes.data.filter(
                (item) => item.category === "PTY"
              );

              setResponseW({
                nowPTY: nowPTY,
                todayPTY: todayPTY,
                tomorrowPTY: tomorrowPTY,
                nowDust: [pm25Grade1h, pm10Grade1h],
              });
            }
          )
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      });
    }
  }, []);

  return (
    <Container rain={rain} hours={hours}>
      <Wrap rain={rain} hours={hours}>
        <TitleWrap>
          <GoChecklistIcon hours={hours} />
          <Title hours={hours}>외출 전 체크리스트</Title>
        </TitleWrap>
        <Recommend responseW={responseW} dust={dust} sdust={sdust} />
        <ItemList hours={hours} userObj={userObj} />
      </Wrap>
    </Container>
  );
};

export default CheckList;

const Container = styled.div`
  background: ${({ rain, hours }) => {
    if (rain == 0 && hours >= 4 && hours <= 19) {
      return "linear-gradient(white 3.5%, #b4dfff)";
    } else if (rain !== 0 && hours >= 4 && hours <= 19) {
      return "linear-gradient(white 3.5%, #C6C6C6)";
    } else if ((hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)) {
      return "linear-gradient(black 3.5%, #0B0085)";
    }
  }};
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-top: 6vh;
  overflow: scroll;
`;

const Wrap = styled.div`
  height: 100%;
  padding-top: 6vh;
  text-align: center;
`;

const TitleWrap = styled.div`
  font-size: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-bottom: 30px;
`;

const GoChecklistIcon = styled(GoChecklist)`
  margin-right: 8px;
  color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "white"
      : "black";
  }};
`;

const Title = styled.div`
  color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "white"
      : "black";
  }};
`;
