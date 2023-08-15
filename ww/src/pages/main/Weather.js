import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Address from "./Address";

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

  const [dataReady, setDataReady] = useState(false);

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const [temperature, setTemperature] = useState(""); // 현재 시간 ~ +6시간 : now, 나머지 : today
  const [sky, setSky] = useState("");
  const [rain, setRain] = useState("");
  const [feature, setFeature] = useState(""); // 현재 시간 ~ +6시간 : now, 나머지 : today
  const [min, setMin] = useState(""); // today
  const [max, setMax] = useState(""); // today
  const [dust, setDust] = useState(""); //
  const [yTemperature, setYTemperature] = useState(""); //
  const [message, setMessage] = useState("");

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

        fetchData("/nowweather", lat, lon, ["T1H", "SKY", "PTY"])
          .then((res) => {
            console.log(res.data);
            const nowT1H = res.data.find((item) => item.category === "T1H");
            const nowSky = res.data.find((item) => item.category === "SKY");
            const nowPTY = res.data.find((item) => item.category === "PTY");

            if (nowT1H) {
              setTemperature(nowT1H.fcstValue);
              console.log(nowT1H.category);
              console.log(nowT1H.fcstValue);
            }

            if (nowSky) {
              setSky(nowSky.fcstValue);
              console.log(nowSky.category);
              console.log(nowSky.fcstValue);
            }

            if (nowPTY) {
              setRain(nowPTY.fcstValue);
              console.log(nowPTY.category);
              console.log(nowPTY.fcstValue);
            }
          })
          .catch((error) => {
            console.error("Error fetching nowweather:", error);
          });

        fetchData("/todayweather", lat, lon, ["TMN", "TMX"])
          .then((res) => {
            console.log(res.data);
            const tmnItem = res.data.find((item) => item.category === "TMN");
            const tmxItem = res.data.find((item) => item.category === "TMX");

            if (tmnItem) {
              const tmnValue = parseFloat(tmnItem.fcstValue);
              setMin(
                Number.isInteger(tmnValue)
                  ? tmnValue.toString()
                  : tmnValue.toFixed(1)
              );
            }

            if (tmxItem) {
              const tmxValue = parseFloat(tmxItem.fcstValue);
              setMax(
                Number.isInteger(tmxValue)
                  ? tmxValue.toString()
                  : tmxValue.toFixed(1)
              );
            }
          })
          .catch((error) => {
            console.error("Error fetching todayweather:", error);
          });

        fetchData("/yesweather", lat, lon, ["T1H"])
          .then((res) => {
            console.log(res.data);
            const yesT1H = res.data.find((item) => item.category === "T1H");

            if (yesT1H) {
              setYTemperature(yesT1H.fcstValue);
              console.log(yesT1H.category);
              console.log(yesT1H.fcstValue);
            }
            let temperatureDiff = yTemperature - temperature;
            let newMessage = "";

            if (temperatureDiff < 0) {
              newMessage = `어제보다 ${Math.abs(temperatureDiff)}도 높아요`;
            } else if (temperatureDiff > 0) {
              newMessage = `어제보다 ${temperatureDiff}도 낮아요`;
            } else {
              newMessage = "어제와 같아요";
            }

            setMessage(newMessage);
          })
          .catch((error) => {
            console.error("Error fetching todayweather:", error);
          })
          .finally(() => {
            // 데이터가 모두 준비되었음을 표시
            setDataReady(true);
          });
      });
    }
  }, []);

  useEffect(() => {
    selectFeature();
  }, [rain, sky]);

  const selectFeature = () => {
    if (rain == "0") {
      if (sky == "1") {
        setFeature("맑음");
      } else if (sky == "2") {
        setFeature("구름조금");
      } else if (sky == "3") {
        setFeature("구름많음");
      } else if (sky == "4") {
        setFeature("흐림");
      }
    } else if (rain == "1") {
      setFeature("비");
    } else if (rain == "2") {
      setFeature("비/눈");
    } else if (rain == "3") {
      setFeature("눈");
    } else if (rain == "5") {
      setFeature("빗방울");
    } else if (rain == "6") {
      setFeature("빗방울눈날림");
    } else if (rain == "7") {
      setFeature("눈날림");
    }
  };

  return (
    <Container>
      {dataReady && (
        <>
          <NowWrap>
            <Address latitude={latitude} longitude={longitude} />
            <Location></Location>
            <Temp>{temperature}</Temp>
            <Feature>{feature}</Feature>
            <MinMax>
              최저: {min} 최고: {max}
            </MinMax>
            <Dust></Dust>
            <CompareWithYesterday>{message}</CompareWithYesterday>
          </NowWrap>
          <TodayWrap>
            <Todays></Todays>
          </TodayWrap>
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

const NowWrap = styled.div``;

const Location = styled.div``;

const Temp = styled.div``;

const Feature = styled.div``;

const MinMax = styled.div``;

const Dust = styled.div``;

const CompareWithYesterday = styled.div``;

const TodayWrap = styled.div``;

const Todays = styled.div``;
