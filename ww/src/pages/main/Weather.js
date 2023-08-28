import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

import TimeWeather from "../../components/main/TimeWeather";
import CurrentWeather from "../../components/main//CurrentWeather";
import Style from "../myStyle/Style";

const Weather = () => {
  const url = "http://localhost:8000";

  const [responseW, setResponseW] = useState({
    nowWeatherRes: [],
    todayWeatherRes: [],
    tomorrowWeatherRes: [],
    nowDustRes: [],
    yesWeatherRes: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  const currentDateTime = new Date();
  const hours = currentDateTime.getHours();

  const [rain, setRain] = useState("");

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

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
          fetchData("/todayweather", lat, lon, [
            "TMN",
            "TMX",
            "TMP",
            "SKY",
            "PTY",
          ]),
          fetchData("/tomorrowweather", lat, lon, ["TMP", "SKY", "PTY"]),
          fetchData("/nowdust", lat, lon),
          fetchData("/yesweather", lat, lon, ["T1H"]),
        ])
          .then(
            ([
              nowWeatherRes,
              todayWeatherRes,
              tomorrowWeatherRes,
              nowDustRes,
              yesWeatherRes,
            ]) => {
              setResponseW({
                nowWeatherRes: nowWeatherRes.data,
                todayWeatherRes: todayWeatherRes.data,
                tomorrowWeatherRes: tomorrowWeatherRes.data,
                nowDustRes: nowDustRes.data,
                yesWeatherRes: yesWeatherRes.data,
              });
              const nowPTY = nowWeatherRes.data.find(
                (item) => item.category === "PTY"
              );
              if (nowPTY) {
                setRain(nowPTY.fcstValue);
              }
              setIsLoading(false);
            }
          )
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      });
    }
  }, [rain, hours]);

  return (
    <Container>
      {isLoading ? (
        <LogoImg src={"/images/logo/wowlogoreverse.gif"} />
      ) : (
        <WrapWeather rain={rain} hours={hours}>
          <CurrentWeather
            responseW={responseW}
            latitude={latitude}
            longitude={longitude}
          />

          <TimeWeather responseW={responseW} />
          <Style />
        </WrapWeather>
      )}
    </Container>
  );
};

export default Weather;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-top: 6vh;
`;

const WrapWeather = styled.div`
  background: ${({ rain, hours }) => {
    console.log(`rain: ${rain} hours: ${hours}`);
    if (rain == 0 && hours >= 4 && hours <= 19) {
      return "linear-gradient(white 3.5%, #b4dfff)";
    } else if (rain !== 0 && hours >= 4 && hours <= 19) {
      return "linear-gradient(white 3.5%, #C6C6C6)";
    } else if ((hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)) {
      return "linear-gradient(black 3.5%, #0B0085)";
    }
  }};
  height: 100vh;
`;

const LogoImg = styled.img`
  justify-content: center;
  justify-items: center;
  align-items: center;
  align-content: center;
  position: relative;
  /* top: calc(var(--vh, 1vh) * 50);
  transform: translateY(-70%); */
  /* width: 100%; */
  height: 50vh;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -khtml-user-drag: none;
  -moz-user-drag: none;
  -o-user-drag: none;
`;

const TodayWrap = styled.div``;

const Todays = styled.div``;
