import React, { useState, useEffect } from "react";
import styled from "styled-components";

const TimeWeather = ({ responseW }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [weatherData2, setWeatherData2] = useState([]);

  const selectFeature = (rain, sky, time) => {
    let feat = "";
    let icon = "";
    switch (rain) {
      case "0":
        switch (sky) {
          case "1":
            feat = "맑음";
            {
              time <= 1900 ? (icon = "01") : (icon = "011");
            }

            break;
          case "2":
            feat = "구름 조금";
            icon = "02";
            {
              time <= 1900 ? (icon = "02") : (icon = "021");
            }
            break;
          case "3":
            feat = "구름 많음";
            {
              time <= 1900 ? (icon = "02") : (icon = "021");
            }
            break;
          case "4":
            feat = "흐림";
            icon = "04";
            break;
          default:
            feat = "";
            icon = "";
        }
        break;
      case "1":
        feat = "비";
        icon = "11";
        break;
      case "2":
        feat = "비 또는 눈";
        icon = "12";
        break;
      case "3":
        feat = "눈";
        icon = "13";
        break;
      case "4":
        feat = "소나기";
        icon = "12";
        break;
      case "5":
        feat = "빗방울";
        icon = "11";
        break;
      case "6":
        feat = "빗방울과 눈 날림";
        icon = "11";
        break;
      case "7":
        feat = "눈 날림";
        icon = "13";
        break;
      default:
        feat = "";
        icon = "";
    }
    return icon;
  };

  const convertTo12HourFormat = (timeString) => {
    let hour = parseInt(timeString.substr(0, 2), 10);
    let period = "오전";

    if (hour >= 12) {
      period = "오후";
      if (hour > 12) {
        hour -= 12;
      }
    }

    return `${period} ${hour}시`;
  };

  const sortByTime = (data) => {
    return data.sort((a, b) => {
      const timeA = a.time;
      const timeB = b.time;

      if (timeA < timeB) {
        return -1;
      }
      if (timeA > timeB) {
        return 1;
      }
      return 0;
    });
  };

  const sortedWeatherData = sortByTime(weatherData);
  const sortedWeatherData2 = sortByTime(weatherData2);

  const now = new Date();
  const nowHours = now.getHours();

  useEffect(() => {
    const processedWeatherData = {};
    const processedWeatherData2 = {};

    console.log("todayWeatherRes:", responseW.todayWeatherRes);
    console.log("tomorrowWeatherRes:", responseW.tomorrowWeatherRes);
    // Process nowWeatherRes and store data in processedWeatherData
    responseW.nowWeatherRes.forEach((item) => {
      const fcstTime = item.fcstTime;
      const category = item.category;
      const fcstValue = item.fcstValue;
      const fcstDate = item.fcstDate;

      const forecastHour = parseInt(fcstTime.substr(0, 2), 10);
      if (forecastHour > nowHours && forecastHour <= nowHours + 5) {
        if (!processedWeatherData[fcstTime]) {
          processedWeatherData[fcstTime] = {
            time: fcstTime,
            fcstDate: fcstDate,
          };
        }

        if (category === "T1H") {
          processedWeatherData[fcstTime].temperature = fcstValue;
        } else if (category === "SKY") {
          processedWeatherData[fcstTime].sky = fcstValue;
        } else if (category === "PTY") {
          processedWeatherData[fcstTime].rain = fcstValue;
        }
      }
    });

    responseW.todayWeatherRes.forEach((item) => {
      const fcstTime = item.fcstTime;
      const category = item.category;
      const fcstValue = item.fcstValue;
      const fcstDate = item.fcstDate;

      const forecastHour = parseInt(fcstTime.substr(0, 2), 10);

      if (forecastHour >= nowHours + 6 && forecastHour <= nowHours + 24) {
        if (!processedWeatherData[fcstTime]) {
          processedWeatherData[fcstTime] = {
            time: fcstTime,
            fcstDate: fcstDate,
          };
        }

        if (category === "TMP") {
          processedWeatherData[fcstTime].temperature = fcstValue;
        } else if (category === "SKY") {
          processedWeatherData[fcstTime].sky = fcstValue;
        } else if (category === "PTY") {
          processedWeatherData[fcstTime].rain = fcstValue;
        }
      }
    });
    console.log(processedWeatherData[1800]);
    responseW.tomorrowWeatherRes.forEach((item) => {
      const fcstTime = item.fcstTime;
      const category = item.category;
      const fcstValue = item.fcstValue;
      const fcstDate = item.fcstDate;

      const forecastHour = parseInt(fcstTime.substr(0, 2), 10);

      if (forecastHour >= 0 && forecastHour <= nowHours) {
        if (!processedWeatherData2[fcstTime]) {
          processedWeatherData2[fcstTime] = {
            time: fcstTime,
            fcstDate: fcstDate,
          };
        }

        if (category === "TMP") {
          processedWeatherData2[fcstTime].temperature = fcstValue;
        } else if (category === "SKY") {
          processedWeatherData2[fcstTime].sky = fcstValue;
        } else if (category === "PTY") {
          processedWeatherData2[fcstTime].rain = fcstValue;
        }
      }
    });

    Object.values(processedWeatherData).forEach((item) => {
      if (item.rain !== undefined && item.sky !== undefined) {
        item.feature = selectFeature(item.rain, item.sky, item.time);
      }
    });

    setWeatherData(Object.values(processedWeatherData));

    Object.values(processedWeatherData2).forEach((item) => {
      if (item.rain !== undefined && item.sky !== undefined) {
        item.feature = selectFeature(item.rain, item.sky, item.time);
      }
    });

    setWeatherData2(Object.values(processedWeatherData2));
  }, []);
  console.log(responseW);

  const [position, setPosition] = useState(0); // Current position for sliding

  // Function to scroll to the previous position
  //   const scrollToPrevious = () => {
  //     const newPosition = Math.max(position - 1, 0);
  //     setPosition(newPosition);
  //   };

  //   // Function to scroll to the next position
  //   const scrollToNext = () => {
  //     const maxPosition =
  //       sortedWeatherData.length + sortedWeatherData2.length - 1;
  //     const newPosition = Math.min(position + 1, maxPosition);
  //     setPosition(newPosition);
  //   };
  return (
    <>
      {/* <button onClick={scrollToPrevious}>Previous</button>
      <button onClick={scrollToNext}>Next</button> */}
      <TimeWeatherWrapper
        hours={nowHours}
        style={{ transform: `translateX(-${position * 320}px)` }}
      >
        {sortedWeatherData.map((item) => (
          <TimeWeatherItem key={`${item.fcstDate}-${item.time}`}>
            <Time>{convertTo12HourFormat(item.time)}</Time>
            {/* <Feat>{item.feature}!</Feat> */}
            <FeatIcon
              src={`/images/icon/${
                nowHours >= 20 || (nowHours >= 0 && nowHours <= 4)
                  ? `${item.feature}w.png`
                  : `${item.feature}.png`
              }`}
            />
            <Temperature>{item.temperature}°</Temperature>
          </TimeWeatherItem>
        ))}
        {sortedWeatherData2.map((item) => (
          <TimeWeatherItem key={`${item.fcstDate}-${item.time}`}>
            <Time>{convertTo12HourFormat(item.time)}</Time>
            {/* <Feat>{item.feature}</Feat> */}
            <FeatIcon
              src={`/images/icon/${
                nowHours >= 20 || (nowHours >= 0 && nowHours <= 4)
                  ? `${item.feature}w.png`
                  : `${item.feature}.png`
              }`}
            />
            <Temperature>{item.temperature}°</Temperature>
          </TimeWeatherItem>
        ))}
      </TimeWeatherWrapper>
    </>
  );
};

export default TimeWeather;

const TimeWeatherWrapper = styled.div`
  /* background-color: rgba(0, 0, 0, 0.04); */
  /* background-color: rgba(255, 255, 255, 0.1); */
  margin: 0 3vw 5vh 3vw;
  padding: 1vh auto;
  display: flex;
  flex-direction: row;
  width: auto; /* Adjust the width to the content */
  overflow-x: scroll; /* Enable horizontal scrolling */
  scroll-snap-type: x mandatory; /* Enable snapping */
  scroll-behavior: smooth; /* Add smooth scrolling effect */
  /* Hide the scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
  color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "white"
      : "black";
  }};
  background-color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.04)";
  }};
`;

const TimeWeatherItem = styled.div`
  min-width: 70px; /* Adjust the width as needed */
  /* flex-shrink: 0; Prevent items from shrinking */
  scroll-snap-align: start; /* Snap items to the start of the viewport */
  padding: 10px;
  margin-right: 10px; /* Add spacing between items */
  text-align: center;
  font-size: 14px;
`;

const Time = styled.div`
  margin-bottom: 3px;
`;

// const Feat = styled.div`
//   margin-bottom: 3px;
// `;

const Temperature = styled.div`
  margin-top: 3px;
`;

const FeatIcon = styled.img`
  height: 24px;
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

// https://icons8.kr/icon/set/weather/material-sharp icon 출처
