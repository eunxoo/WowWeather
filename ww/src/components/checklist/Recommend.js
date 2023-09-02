import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment-timezone";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";

const Recommend = ({ responseW, dust, sdust }) => {
  moment.tz.setDefault("Asia/Seoul");
  const hours = moment().hour();
  const [isLoading, setIsLoading] = useState(true);
  const [recommend, setRecommend] = useState([]);

  const [outingTimes, setOutingTimes] = useState({
    outing1Time: "",
    outing2Time: "",
  });

  const getDate = () => {
    const today = moment();
    return today.format("YYYYMMDD");
  };

  const getTomorrowDate = () => {
    const tomorrow = moment().add(1, "days");
    return tomorrow.format("YYYYMMDD");
  };

  const formatTimeToFixedHours = (time) => {
    const [hour, _] = time.split(":");
    const formattedHour = hour.length === 1 ? `0${hour}` : hour;
    return `${formattedHour}00`;
  };

  const onOutingTimeChange = (e) => {
    const { name, value } = e.target;
    setRecommend([]);
    setOutingTimes((prevTimes) => ({
      ...prevTimes,
      [name]: value,
    }));
  };

  const showResult = () => {
    console.log(responseW);
    setIsLoading(false);
    if (dust >= 3 || sdust >= 3) {
      setRecommend((prevRecommend) =>
        !prevRecommend.includes("마스크")
          ? [...prevRecommend, "마스크"]
          : prevRecommend
      );
    }

    if (outingTimes.outing1Time && outingTimes.outing2Time) {
      const outingStartTime = formatTimeToFixedHours(outingTimes.outing1Time);
      const outingEndTime = formatTimeToFixedHours(outingTimes.outing2Time);
      console.log(outingEndTime);
      if (
        outingTimes.outing1Time &&
        outingTimes.outing2Time &&
        responseW.nowPTY
      ) {
        responseW.nowPTY.forEach((item) => {
          console.log("fcstTime:", item.fcstTime);
          console.log("fcstValue:", item.fcstValue);
          if (
            item.fcstTime >= outingStartTime &&
            item.fcstTime <= outingEndTime &&
            item.fcstValue !== "0"
          ) {
            setRecommend((prevRecommend) =>
              !prevRecommend.includes("우산")
                ? [...prevRecommend, "우산"]
                : prevRecommend
            );
          }
        });
      }

      if (
        outingTimes.outing1Time &&
        outingTimes.outing2Time &&
        responseW.todayPTY
      ) {
        responseW.todayPTY.forEach((item) => {
          if (
            item.fcstDate == getDate() &&
            item.fcstTime >= outingStartTime &&
            item.fcstTime <= outingEndTime &&
            item.fcstValue !== "0"
          ) {
            console.log(item.fcstValue);
            console.log(item.fcstTime);
            console.log(item.fcstDate);
            setRecommend((prevRecommend) =>
              !prevRecommend.includes("우산")
                ? [...prevRecommend, "우산"]
                : prevRecommend
            );
          }
        });
      }

      if (
        outingTimes.outing1Time &&
        outingTimes.outing2Time &&
        responseW.todayPTY &&
        outingStartTime >= 1200 &&
        outingEndTime < 1200 &&
        responseW.tomorrowPTY &&
        responseW.tomorrowPTY.some(
          (item) =>
            (item.fcstDate == getTomorrowDate()) & (item.fcstValue !== "0") &&
            item.fcstTime <= outingEndTime
        )
      ) {
        setRecommend((prevRecommend) =>
          !prevRecommend.includes("우산")
            ? [...prevRecommend, "우산"]
            : prevRecommend
        );
      }
      console.log(getTomorrowDate());
      console.log(hours);
      console.log(hours >= 12);
      console.log(outingStartTime < 1200);
      if (
        outingTimes.outing1Time &&
        outingTimes.outing2Time &&
        hours >= 12 &&
        outingStartTime < 1200 &&
        responseW.tomorrowPTY &&
        responseW.tomorrowPTY.some(
          (item) =>
            item.fcstDate == getTomorrowDate() &&
            item.fcstValue !== "0" &&
            item.fcstTime >= outingStartTime &&
            item.fcstTime <= outingEndTime
        )
      ) {
        setRecommend((prevRecommend) =>
          !prevRecommend.includes("우산")
            ? [...prevRecommend, "우산"]
            : prevRecommend
        );
      }
    }

    console.log(recommend);
  };
  return (
    <RecommendDiv hours={hours}>
      <RecoTitle>오늘의 추천 아이템</RecoTitle>
      <OutWrap>
        <TimeWrap>
          <Outing>외출 시간</Outing>
          <InputOuting1
            type="time"
            name="outing1Time"
            value={outingTimes.outing1Time}
            onChange={onOutingTimeChange}
          ></InputOuting1>
        </TimeWrap>
        <TimeWrap>
          <Outing>귀가 시간</Outing>
          <InputOuting2
            type="time"
            name="outing2Time"
            value={outingTimes.outing2Time}
            onChange={onOutingTimeChange}
          ></InputOuting2>
        </TimeWrap>
        <SubButton
          onClick={showResult}
          disabled={
            responseW.nowPTY.length === 0 &&
            responseW.todayPTY.length === 0 &&
            responseW.tomorrowPTY.length === 0
          }
        >
          확인
        </SubButton>
      </OutWrap>
      {isLoading ? (
        <ContentWrap></ContentWrap>
      ) : (
        <ContentWrap>
          <RecoContent>
            {recommend.length === 0 ? (
              <Div>추천 아이템이 없습니다</Div>
            ) : (
              recommend.map((item, index) => (
                <Reco key={index}>
                  <BsChevronCompactLeft />
                  <Div>{item}</Div>
                  <BsChevronCompactRight />
                </Reco>
              ))
            )}
          </RecoContent>
        </ContentWrap>
      )}
    </RecommendDiv>
  );
};

export default Recommend;

const RecommendDiv = styled.div`
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
  border-radius: 50px;
  padding: 1vh 1vw;
  margin: 3vh 3vw;
`;

const RecoTitle = styled.div`
  margin: 2vh auto;
`;

const OutWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const TimeWrap = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1vh 0;
`;

const Outing = styled.div`
  margin-bottom: 1vh;
`;

const InputOuting1 = styled.input`
  border: none;
`;

const InputOuting2 = styled.input`
  border: none;
`;

const SubButton = styled.button`
  height: 3vh;
  color: black;
  background-color: white;
  border: 1px solid black;
  border-radius: 5px;
  align-self: center;

  &[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
    --button-bg: #ccc;
  }
`;

const ContentWrap = styled.div`
  margin: 2vh auto;
`;

const RecoContent = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 10px;
`;

const Reco = styled.div`
  display: flex;
  flex-direction: row;
`;

const Div = styled.div``;
