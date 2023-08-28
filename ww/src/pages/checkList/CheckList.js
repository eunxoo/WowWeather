import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { GoChecklist } from "react-icons/go";
import { VscAdd } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";

import axios from "axios";
import CheckBox from "../../components/checklist/CheckBox";
import { fireStoreJob } from "../../fbase";
import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  orderBy,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

const CheckList = ({ userObj }) => {
  const url =
    "https://port-0-wow-node-express-54ouz2lllulbggn.sel3.cloudtype.app";
  const currentDateTime = new Date();
  const hours = currentDateTime.getHours();
  const [rain, setRain] = useState("");
  const [dust, setDust] = useState("");
  const [sdust, setSDust] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [recommend, setRecommend] = useState([]);

  const [responseW, setResponseW] = useState({
    nowPTY: [],
    todayPTY: [],
    tomorrowPTY: [],
    nowDust: [],
  });

  const [outingTimes, setOutingTimes] = useState({
    outing1Time: "",
    outing2Time: "",
  });

  const getDate = () => {
    let today = new Date(new Date());
    let yyyy = today.getFullYear().toString();
    let mm = today.getMonth() + 1;
    mm = mm < 10 ? "0" + mm.toString() : mm.toString();
    let dd = today.getDate();
    dd = dd < 10 ? "0" + dd.toString() : dd.toString();
    return yyyy + mm + dd;
  };

  const getTomorrowDate = () => {
    let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    let yyyy = tomorrow.getFullYear().toString();
    let mm = tomorrow.getMonth() + 1;
    mm = mm < 10 ? "0" + mm.toString() : mm.toString();
    let dd = tomorrow.getDate();
    dd = dd < 10 ? "0" + dd.toString() : dd.toString();
    return yyyy + mm + dd;
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
        responseW.nowPTY &&
        responseW.nowPTY.fcstTime >= outingStartTime &&
        responseW.nowPTY.fcstTime <= outingEndTime &&
        responseW.nowPTY.fcstValue !== "0"
      ) {
        setRecommend((prevRecommend) =>
          !prevRecommend.includes("우산")
            ? [...prevRecommend, "우산"]
            : prevRecommend
        );
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

              // if (
              //   outingTimes.outing1Time &&
              //   outingTimes.outing2Time &&
              //   nowPTY &&
              //   nowPTY.fcstTime >= outingStartTime &&
              //   nowPTY.fcstTime <= outingEndTime &&
              //   nowPTY.fcstValue !== "0"
              // ) {
              //   setRecommend((prevRecommend) =>
              //     !prevRecommend.includes("우산")
              //       ? [...prevRecommend, "우산"]
              //       : prevRecommend
              //   );
              // }

              // if (
              //   outingTimes.outing1Time &&
              //   outingTimes.outing2Time &&
              //   todayPTY &&
              //   todayPTY.fcstTime >= outingStartTime &&
              //   todayPTY.fcstTime <= outingEndTime &&
              //   todayPTY.fcstValue !== "0"
              // ) {
              //   setRecommend((prevRecommend) =>
              //     !prevRecommend.includes("우산")
              //       ? [...prevRecommend, "우산"]
              //       : prevRecommend
              //   );
              // }

              // if (
              //   outingTimes.outing1Time &&
              //   outingTimes.outing2Time &&
              //   todayPTY &&
              //   outingStartTime >= 1200 && // 오후 12시 이상인지 확인
              //   outingEndTime < 1200 &&
              //   tomorrowPTY &&
              //   tomorrowPTY.fcstTime <= outingEndTime
              // ) {
              //   setRecommend((prevRecommend) =>
              //     !prevRecommend.includes("우산")
              //       ? [...prevRecommend, "우산"]
              //       : prevRecommend
              //   );
              // }

              // setRecommend([...recommend, updatedRecommend]);

              // console.log(outingStartTime);
              // }

              // console.log(recommend);
            }
          )
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      });
    }
  }, []);

  const [check, setCheck] = useState("");

  const onChange = (e) => {
    const {
      target: { value },
    } = e;
    setCheck(value);
  };

  const onClick = async () => {
    if (check === "") {
      alert("항목을 입력해주세요");
      return false;
    }

    const checkObj = {
      uid: userObj.uid,
      check: check,
      checked: false,
      createAt: Date.now(),
    };

    await addDoc(collection(fireStoreJob, "checklist"), checkObj);
    setCheck("");
  };

  const [list, setList] = useState([]);

  useEffect(() => {
    const q = query(
      collection(fireStoreJob, "checklist"),
      where("uid", "==", userObj.uid),
      orderBy("createAt", "asc")
    );
    onSnapshot(q, (snapshot) => {
      const checkArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setList(checkArr);
    });
  }, []);
  console.log(list);
  const onDeleteClick = async (itemId) => {
    const ok = window.confirm("이 항목을 삭제하겠습니까?");
    if (ok) {
      const itemRef = doc(fireStoreJob, "checklist", itemId);
      await deleteDoc(itemRef);
    }
  };

  const onCheckedClick = async (itemId, checkedValue) => {
    const itemRef = doc(fireStoreJob, "checklist", itemId);
    if (itemRef) {
      await updateDoc(itemRef, { checked: !checkedValue });
    }
  };

  console.log(outingTimes);
  return (
    <Container rain={rain} hours={hours}>
      <Wrap rain={rain} hours={hours}>
        <TitleWrap>
          <GoChecklistIcon hours={hours} />
          <Title hours={hours}>외출 전 체크리스트</Title>
        </TitleWrap>
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
              hours={hours}
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
        <Div>
          <FormWrap>
            <InputThing
              onChange={onChange}
              value={check}
              placeholder="입력하기.."
              type={"text"}
              maxLength={15}
            />
            <VscAddIcon hours={hours}>
              <VscAdd onClick={onClick} />
            </VscAddIcon>
          </FormWrap>
          {list.length > 0 && (
            <List hours={hours}>
              {list.map((data) => (
                <ListItem key={data.id} hours={hours}>
                  <StyledLabel>
                    <StyledInput
                      type="checkbox"
                      checked={data.checked}
                      onChange={() => {
                        onCheckedClick(data.id, data.checked);
                      }}
                    />
                    <Item id={data.id}>{data.check}</Item>
                  </StyledLabel>
                  <MdDelete
                    onClick={() => onDeleteClick(data.id)}
                    className="deleteIcon"
                  />
                </ListItem>
              ))}
              <br />
            </List>
          )}
        </Div>
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
  color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "black"
      : "white";
  }};
  background-color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "white"
      : "black";
  }};
  border: none;
  align-self: center;
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

const FormWrap = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const InputThing = styled.input`
  width: 80vw;
  height: 3vh;
  border: none;
  border-radius: 10px;
  padding: 3vh 1vw;
  font-size: 3vh;
  opacity: 0.8;
`;

const VscAddIcon = styled.div`
  /* position: absolute;
  right: 2vw; */
  height: 3vh;
  padding: 3vh 0;
  color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "white"
      : "black";
  }};
`;

const List = styled.div`
  margin: 2vh 3vw;
  display: flex;
  flex-direction: column;
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
  border-radius: 10px;
  padding: 1vh 0;
`;

const ListItem = styled.div`
  position: relative;
  top: 1vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "white"
      : "black";
  }};
  padding: 1vh 0;

  .deleteIcon {
    position: absolute;
    font-size: 20px;
    right: 10px;
  }
`;

const Item = styled.div`
  width: 70vw;
  text-align: left;
  margin-left: 10px;
`;

const StyledLabel = styled.label`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StyledInput = styled.input`
  margin-left: 10px;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border: 1.5px solid gainsboro;
  border-radius: 0.35rem;
  background-color: white;
  transition: background-color 0.3s, border-color 0.3s;

  &:checked {
    border-color: transparent;
    background-size: 100% 100%;
    background-position: 50%;
    background-repeat: no-repeat;
    background-color: #31b5ff;
  }
`;
