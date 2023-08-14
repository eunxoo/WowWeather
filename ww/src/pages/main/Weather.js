import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";

const Weather = () => {
  const url = "http://localhost:8000";
  const [data, setData] = useState({});
  const fetchApi = () => {
    fetch("/data")
      .then((res) => res.json())
      .then(
        (data) => setData(data),
        () => {
          console.log("data read : ", data);
        }
      );
  };

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

        fetchData("/nowweather", lat, lon)
          .then((res) => {
            console.log(res.data);
            // 여기서 res.data를 활용하여 원하는 상태 업데이트를 수행하세요.
          })
          .catch((error) => {
            console.error("Error fetching nowweather:", error);
          });

        fetchData("/todayweather", lat, lon)
          .then((res) => {
            console.log(res.data);
            // 여기서 res.data를 활용하여 원하는 상태 업데이트를 수행하세요.
          })
          .catch((error) => {
            console.error("Error fetching todayweather:", error);
          });
      });
    }
  }, []);

  return (
    <Container>
      <Wrap>
        <Location></Location>
        <Temp></Temp>
        <Feature></Feature>
        <MinMax></MinMax>
        <Dust></Dust>
        <CompareWithYesterday></CompareWithYesterday>
        <button onClick={fetchApi}>btn</button>
        {data.lastname} {data.firstname}
      </Wrap>
      <Todays></Todays>
    </Container>
  );
};

export default Weather;

const Container = styled.div`
  height: 100%;
  padding-top: 6vh;
`;

const Wrap = styled.div``;

const Location = styled.div``;

const Temp = styled.div``;

const Feature = styled.div``;

const MinMax = styled.div``;

const Dust = styled.div``;

const CompareWithYesterday = styled.div``;

const Todays = styled.div``;
