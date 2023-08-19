import React, { useState, useEffect } from "react";
import styled from "styled-components";

const TimeWeather = ({ responseW }) => {
  const [weatherData, setWeatherData] = useState([]);
  const [weatherData2, setWeatherData2] = useState([]);

  const selectFeature = (rain, sky) => {
    let feat = "";
    switch (rain) {
      case "0":
        switch (sky) {
          case "1":
            feat = "맑음";
            break;
          case "2":
            feat = "구름 조금";
            break;
          case "3":
            feat = "구름 많음";
            break;
          case "4":
            feat = "흐림";
            break;
          default:
            feat = "";
        }
        break;
      case "1":
        feat = "비";
        break;
      case "2":
        feat = "비 또는 눈";
        break;
      case "3":
        feat = "눈";
        break;
      case "5":
        feat = "빗방울";
        break;
      case "6":
        feat = "빗방울과 눈 날림";
        break;
      case "7":
        feat = "눈 날림";
        break;
      default:
        feat = "";
    }
    return feat;
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

  useEffect(() => {
    const processedWeatherData = {};
    const processedWeatherData2 = {};
    const now = new Date();

    console.log("todayWeatherRes:", responseW.todayWeatherRes);
    console.log("tomorrowWeatherRes:", responseW.tomorrowWeatherRes);
    // Process nowWeatherRes and store data in processedWeatherData
    responseW.nowWeatherRes.forEach((item) => {
      const fcstTime = item.fcstTime;
      const category = item.category;
      const fcstValue = item.fcstValue;
      const fcstDate = item.fcstDate;

      const forecastHour = parseInt(fcstTime.substr(0, 2), 10);
      if (forecastHour > now.getHours() && forecastHour <= now.getHours() + 5) {
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

      if (
        forecastHour >= now.getHours() + 6 &&
        forecastHour <= now.getHours() + 24
      ) {
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

    responseW.tomorrowWeatherRes.forEach((item) => {
      const fcstTime = item.fcstTime;
      const category = item.category;
      const fcstValue = item.fcstValue;
      const fcstDate = item.fcstDate;

      const forecastHour = parseInt(fcstTime.substr(0, 2), 10);

      if (forecastHour >= 0 && forecastHour <= now.getHours()) {
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
        item.feature = selectFeature(item.rain, item.sky);
      }
      console.log(item.rain, item.sky, item.feature);
    });

    setWeatherData(Object.values(processedWeatherData));

    Object.values(processedWeatherData2).forEach((item) => {
      if (item.rain !== undefined && item.sky !== undefined) {
        item.feature = selectFeature(item.rain, item.sky);
      }
      console.log(item.rain, item.sky, item.feature);
    });

    setWeatherData2(Object.values(processedWeatherData2));

    console.log(processedWeatherData2);
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
        style={{ transform: `translateX(-${position * 320}px)` }}
      >
        {sortedWeatherData.map((item) => (
          <TimeWeatherItem key={`${item.fcstDate}-${item.time}`}>
            <Temperature>{item.fcstDate}</Temperature>
            <Time>{convertTo12HourFormat(item.time)}</Time>
            <Temperature>{item.temperature}°</Temperature>
            <Feat>{item.feature}</Feat>
          </TimeWeatherItem>
        ))}
        {sortedWeatherData2.map((item) => (
          <TimeWeatherItem key={`${item.fcstDate}-${item.time}`}>
            <Temperature>{item.fcstDate}</Temperature>
            <Time>{convertTo12HourFormat(item.time)}</Time>
            <Temperature>{item.temperature}°</Temperature>
            <Feat>{item.feature}</Feat>
          </TimeWeatherItem>
        ))}
      </TimeWeatherWrapper>
    </>
  );
};

export default TimeWeather;

const TimeWeatherWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%; /* Adjust the width to the content */
  overflow-x: scroll; /* Enable horizontal scrolling */
  scroll-snap-type: x mandatory; /* Enable snapping */
  scroll-behavior: smooth; /* Add smooth scrolling effect */
  /* Hide the scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TimeWeatherItem = styled.div`
  min-width: 30px; /* Adjust the width as needed */
  flex-shrink: 0; /* Prevent items from shrinking */
  scroll-snap-align: start; /* Snap items to the start of the viewport */
  border: 1px solid #ccc; /* Add a border for visualization */
  padding: 10px;
  margin-right: 10px; /* Add spacing between items */
`;

const Time = styled.div``;

const Temperature = styled.div``;

const Feat = styled.div``;
