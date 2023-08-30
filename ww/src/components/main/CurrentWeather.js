import React, { useState, useEffect } from "react";
import styled from "styled-components";
import moment from "moment-timezone";
import Address from "./Address";

const CurrentWeather = ({ responseW, latitude, longitude }) => {
  moment.tz.setDefault("Asia/Seoul");
  console.log(moment().hour());
  const nowHours = moment().hour();
  // pm25Grade1h 및 pm10Grade1h 값을 변환하여 등급으로 표시하는 함수
  const nowWeatherRes = responseW.nowWeatherRes;
  const todayWeatherRes = responseW.todayWeatherRes;
  const nowDustRes = responseW.nowDustRes;
  const yesWeatherRes = responseW.yesWeatherRes;
  console.log("lat" + latitude + "lon" + longitude);
  const [temperature, setTemperature] = useState(""); // 현재 시간 ~ +6시간 : now, 나머지 : today
  const [sky, setSky] = useState("");
  const [rain, setRain] = useState("");
  const [feature, setFeature] = useState(""); // 현재 시간 ~ +6시간 : now, 나머지 : today
  const [min, setMin] = useState(""); // today
  const [max, setMax] = useState(""); // today
  const [dust, setDust] = useState(""); //
  const [sdust, setSDust] = useState(""); //
  const [yTemperature, setYTemperature] = useState(""); //
  const [message, setMessage] = useState("");

  // const now = new Date();
  // const nowHours = now.getHours();

  const getGrade = (value) => {
    switch (value) {
      case "1":
        return "좋음";
      case "2":
        return "보통";
      case "3":
        return "나쁨";
      case "4":
        return "매우나쁨";
      default:
        return "";
    }
  };

  const selectFeature = (rain, sky) => {
    switch (rain) {
      case "0":
        switch (sky) {
          case "1":
            setFeature("맑음");
            break;
          case "2":
            setFeature("구름 조금");
            break;
          case "3":
            setFeature("구름 많음");
            break;
          case "4":
            setFeature("흐림");
            break;
          default:
            setFeature("");
        }
        break;
      case "1":
        setFeature("비");
        break;
      case "2":
        setFeature("비 또는 눈");
        break;
      case "3":
        setFeature("눈");
        break;
      case "4":
        setFeature("소나기");
        break;
      case "5":
        setFeature("빗방울");
        break;
      case "6":
        setFeature("빗방울과 눈 날림");
        break;
      case "7":
        setFeature("눈 날림");
        break;
      default:
        setFeature("");
    }
  };

  useEffect(() => {
    // ... (날씨 데이터 처리)
    const nowT1H = nowWeatherRes.find((item) => item.category === "T1H");
    const nowSky = nowWeatherRes.find((item) => item.category === "SKY");
    const nowPTY = nowWeatherRes.find((item) => item.category === "PTY");
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

    // ... (오늘의 최저 및 최고 기온 데이터 처리)
    const tmnItem = todayWeatherRes.find((item) => item.category === "TMN");
    const tmxItem = todayWeatherRes.find((item) => item.category === "TMX");
    if (tmnItem) {
      const tmnValue = parseFloat(tmnItem.fcstValue);
      setMin(
        Number.isInteger(tmnValue) ? tmnValue.toString() : tmnValue.toFixed(1)
      );
    }

    if (tmxItem) {
      const tmxValue = parseFloat(tmxItem.fcstValue);
      setMax(
        Number.isInteger(tmxValue) ? tmxValue.toString() : tmxValue.toFixed(1)
      );
    }

    // ... (미세먼지 데이터 처리)
    const pm25Grade1h = getGrade(nowDustRes.pm25Grade1h);
    const pm10Grade1h = getGrade(nowDustRes.pm10Grade1h);
    setDust(pm10Grade1h || "-"); // 만약 null이면 "-"로 설정
    setSDust(pm25Grade1h || "-");

    // ... (어제 기온 데이터 처리)
    const yesT1H = yesWeatherRes.find((item) => item.category === "T1H");
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
    // setIsLoading(false);

    selectFeature(rain, sky);
  }, [rain, sky]);

  console.log(responseW.nowWeatherRes);
  return (
    <>
      <NowWrap hours={nowHours}>
        <Address latitude={latitude} longitude={longitude} hours={nowHours} />
        <Temp>{temperature}°</Temp>

        <Feature>{feature}</Feature>
        <MinMax>{`최저: ${min}° / 최고: ${max}°`}</MinMax>
        <Dust>{`미세먼지: ${dust} / 초미세먼지: ${sdust}`}</Dust>
        <CompareWithYesterday>{message}</CompareWithYesterday>
      </NowWrap>
    </>
  );
};

export default CurrentWeather;

const NowWrap = styled.div`
  margin: 5vh auto;
  display: flex;
  flex-direction: column;
  text-align: center;
  z-index: 4;
  color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "white"
      : "black";
  }};
`;

const Temp = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 70px;
  margin-bottom: -3px;
  margin-left: 10px;
`;

const Feature = styled.div`
  font-size: 20px;
  margin-bottom: 5px;
`;

const MinMax = styled.div`
  font-size: 16px;
  margin-bottom: 5px;
`;

const Dust = styled.div`
  font-size: 16px;
  margin-bottom: 5px;
`;

const CompareWithYesterday = styled.div`
  font-size: 16px;
`;
