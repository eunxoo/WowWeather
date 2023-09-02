import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs";
import moment from "moment-timezone";
import axios from "axios";
axios.defaults.withCredentials = true;

const Style = ({ responseW }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPLoading, setIsPLoading] = useState(true);
  const [style, setStyle] = useState();
  const [responseS, setResponseS] = useState({
    ctopRes: [],
    cbottomRes: [],
    gtopRes: [],
    gbottomRes: [],
    ftopRes: [],
    fbottomRes: [],
  });
  const [tstyle, setTStyle] = useState([]);
  const [bstyle, setBStyle] = useState([]);
  const [averageTemperature, setAverageTemperature] = useState();
  const [temperatureDifference, setTemperatureDifference] = useState();
  moment.tz.setDefault("Asia/Seoul");
  console.log(moment().hour());
  const nowHours = moment().hour();
  const today = moment().format("YYYYMMDD");
  const [selectedStyle, setSelectedStyle] = useState(""); // 선택된 스타일 상태

  const handleStyleButtonClick = (style) => {
    setSelectedStyle(style);
  };

  const fetchData = (url) => {
    return axios({
      url: url,
      method: "post",
      data: {
        average_temperature: averageTemperature,
        temperature_difference: temperatureDifference,
      },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
  };

  const getRandomIndex = (arr) => {
    const shuffled = arr.slice();
    let i = arr.length;
    const result = [];

    while (i-- && result.length < 3) {
      const index = Math.floor((i + 1) * Math.random()); // 0부터 i까지의 랜덤한 인덱스 선택
      const element = shuffled[index];
      shuffled[index] = shuffled[i]; // 선택한 원소와 마지막 원소를 교체 (재선택 방지)
      result.push(element);
    }

    return result;
  };

  const onClickStyle = () => {
    setIsLoading(true);
    setIsPLoading(false);
    const apiUrls = [
      "/ctop",
      "/cbottom",
      "/gtop",
      "/gbottom",
      "/ftop",
      "/fbottom",
    ];
    const apiRequests = apiUrls.map((url) => fetchData(url));
    Promise.all(apiRequests)
      .then(
        ([ctopRes, cbottomRes, gtopRes, gbottomRes, ftopRes, fbottomRes]) => {
          setResponseS({
            ctopRes: ctopRes.data.cluster_images,
            cbottomRes: cbottomRes.data.cluster_images,
            gtopRes: gtopRes.data.cluster_images,
            gbottomRes: gbottomRes.data.cluster_images,
            ftopRes: ftopRes.data.cluster_images,
            fbottomRes: fbottomRes.data.cluster_images,
          });
          setIsLoading(false);
          setIsPLoading(true);
        }
      )
      .catch((error) => {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      });
  };

  const onClickC = () => {
    setTStyle([]);
    setBStyle([]);
    if (responseS.ctopRes && responseS.cbottomRes) {
      const top = getRandomIndex(responseS.ctopRes);
      const bottom = getRandomIndex(responseS.cbottomRes);
      setTStyle(top);
      setBStyle(bottom);
    }
  };

  const onClickG = () => {
    setTStyle([]);
    setBStyle([]);

    if (responseS.gtopRes && responseS.gbottomRes) {
      const top = getRandomIndex(responseS.gtopRes);
      const bottom = getRandomIndex(responseS.gbottomRes);
      setTStyle(top);
      setBStyle(bottom);
    }
  };

  const onClickF = () => {
    setTStyle([]);
    setBStyle([]);

    if (responseS.ftopRes && responseS.fbottomRes) {
      const top = getRandomIndex(responseS.ftopRes);
      const bottom = getRandomIndex(responseS.fbottomRes);
      setTStyle(top);
      setBStyle(bottom);
    }
  };
  console.log(tstyle);

  console.log(nowHours);
  useEffect(() => {
    console.log(tstyle);
  }, [responseS]);

  useEffect(() => {
    const tmnItem = responseW.tfweatherRes.find(
      (item) => item.category === "TMN"
    );
    const tmxItem = responseW.tfweatherRes.find(
      (item) => item.category === "TMX"
    );

    console.log(parseFloat(tmxItem.fcstValue) - parseFloat(tmnItem.fcstValue));
    setTemperatureDifference(
      parseFloat(tmxItem.fcstValue) - parseFloat(tmnItem.fcstValue)
    );

    const filteredItems = responseW.tfweatherRes.filter((item) => {
      return (
        item.category === "TMP" &&
        item.fcstDate === today &&
        item.fcstTime >= "0000" &&
        item.fcstTime <= "2300"
      );
    });

    const temperatures = filteredItems.map((item) =>
      parseFloat(item.fcstValue)
    );

    const totalTemperature = temperatures.reduce((acc, cur) => acc + cur, 0);
    setAverageTemperature(totalTemperature / temperatures.length);

    console.log("기온 평균:", averageTemperature);
  }, [responseS]);

  console.log(tstyle);
  return (
    <Container hours={nowHours}>
      {isLoading ? (
        isPLoading ? (
          <TodayStyle onClick={onClickStyle}>오늘의 스타일 보기</TodayStyle>
        ) : (
          <TodayStyle>
            <LoaderImg src={`/images/icon/preloader.gif`} alt="로딩 중" />
          </TodayStyle>
        )
      ) : (
        <>
          <ButtonDiv>
            <CasualB
              selected={selectedStyle === "casual"}
              onClick={() => {
                handleStyleButtonClick("casual");
                onClickC();
              }}
            >
              캐주얼
            </CasualB>
            <GirlishB
              selected={selectedStyle === "girlish"}
              onClick={() => {
                handleStyleButtonClick("girlish");
                onClickG();
              }}
            >
              걸리쉬
            </GirlishB>
            <FormalB
              selected={selectedStyle === "formal"}
              onClick={() => {
                handleStyleButtonClick("formal");
                onClickF();
              }}
            >
              포멀
            </FormalB>
            {/* <RefreshB onClick={onClickRefresh()}> 새로고침</RefreshB> */}
          </ButtonDiv>
          <TopDiv hours={nowHours}>
            <Div>상의</Div>
            <ImgDiv>
              {tstyle.map((style, index) => (
                <Img key={index} src={`https:${style}`} alt={`Top ${index}`} />
              ))}
            </ImgDiv>
          </TopDiv>
          <BottomDiv hours={nowHours}>
            <Div>하의</Div>
            <ImgDiv>
              {bstyle.map((style, index) => (
                <Img
                  key={index}
                  src={`https:${style}`}
                  alt={`Bottom ${index}`}
                />
              ))}
            </ImgDiv>
            {/* <img
          src="https://image.msscdn.net/mfile_s01/_street_images/67602/280.street_img_view15ff68f6c238d1.jpg?20210107093155"
          alt="이미지"
        /> */}
          </BottomDiv>
        </>
      )}
    </Container>
  );
};

export default Style;

const Container = styled.div`
  background-color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.04)";
  }};
  margin: 0 3vw 5vh 3vw;
  padding: 2vh 2vw;
  color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "white"
      : "black";
  }};
`;

const TodayStyle = styled.div`
  text-align: center;
`;

const LoaderImg = styled.img``;

const ButtonDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const Button = styled.button`
  border: none;
  margin: auto 4vw;
  padding: 1vh 2vw;
  background-color: ${({ selected }) => (selected ? "white" : "grey")};
  border-radius: 10px;
  font-size: 15px;
`;

const CasualB = styled(Button)``;

const GirlishB = styled(Button)``;

const FormalB = styled(Button)``;

const TopDiv = styled.div`
  margin-top: 2vh;
  background-color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.04)";
  }};
  border-radius: 10px;
`;

const BottomDiv = styled.div`
  margin-top: 2vh;
  background-color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "rgba(255, 255, 255, 0.1)"
      : "rgba(0, 0, 0, 0.04)";
  }};
  border-radius: 10px;
`;

const Div = styled.div`
  padding: 2vh 1vw;
  font-weight: bold;
  text-align: center;
  font-size: large;
`;

const ImgDiv = styled.div`
  /* background-color: whitesmoke; */
  border-radius: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 20vh;
`;

const Img = styled.img`
  width: 30%;
  /* height:  */
  object-fit: cover;
  border-radius: 10px;
`;
