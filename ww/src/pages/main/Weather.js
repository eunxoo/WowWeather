import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

import TimeWeather from "./TimeWeather";
import CurrentWeather from "./CurrentWeather";

const Weather = () => {
  const url = "http://localhost:8000";

  const [responseW, setResponseW] = useState({
    nowWeatherRes: [],
    todayWeatherRes: [],
    tomorrowWeatherRes: [],
  });

  const [isLoading, setIsLoading] = useState(true);

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

              setIsLoading(false);
            }
          )
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      });
    }
  }, []);

  return (
    <Container>
      {isLoading ? (
        <LoadingIndicator>로딩 중...</LoadingIndicator>
      ) : (
        <>
          <CurrentWeather responseW={responseW} />

          <TimeWeather responseW={responseW} />
        </>
      )}
    </Container>
  );
};

export default Weather;

const Container = styled.div`
  height: 100%;
  padding-top: 6vh;
`;

const LoadingIndicator = styled.div``;

const TodayWrap = styled.div``;

const Todays = styled.div``;
