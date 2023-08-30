import React, { useState } from "react";
import styled from "styled-components";
import moment from "moment-timezone";

const Style = () => {
  moment.tz.setDefault("Asia/Seoul");
  console.log(moment().hour());
  const nowHours = moment().hour();
  const [selectedStyle, setSelectedStyle] = useState(""); // 선택된 스타일 상태

  const handleStyleButtonClick = (style) => {
    setSelectedStyle(style);
  };
  // const nowHours = new Date().getHours();
  console.log(nowHours);
  return (
    <Container hours={nowHours}>
      <ButtonDiv>
        <FormalB
          selected={selectedStyle === "formal"}
          onClick={() => handleStyleButtonClick("formal")}
        >
          포멀
        </FormalB>
        <CasualB
          selected={selectedStyle === "casual"}
          onClick={() => handleStyleButtonClick("casual")}
        >
          캐주얼
        </CasualB>
        <FeminineB
          selected={selectedStyle === "feminine"}
          onClick={() => handleStyleButtonClick("feminine")}
        >
          페미닌
        </FeminineB>
      </ButtonDiv>
      <TopDiv>
        <Div>상의</Div>
        <ImgDiv>
          {selectedStyle && (
            <img src={`URL_FOR_${selectedStyle}_TOP_IMAGE`} alt="Top" />
          )}
        </ImgDiv>
      </TopDiv>
      <BottomDiv>
        <Div>하의</Div>
        <ImgDiv>
          {selectedStyle && (
            <img src={`URL_FOR_${selectedStyle}_BOTTOM_IMAGE`} alt="Bottom" />
          )}
        </ImgDiv>
      </BottomDiv>
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

const ButtonDiv = styled.div``;

const Button = styled.button`
  background-color: ${({ selected }) => (selected ? "lightgray" : "white")};
  /* 스타일 선택 여부에 따라 버튼 배경색 변경 */
`;

const FormalB = styled(Button)``;

const CasualB = styled(Button)``;

const FeminineB = styled(Button)``;

const TopDiv = styled.div`
  margin-top: 2vh;
`;

const BottomDiv = styled.div`
  margin-top: 2vh;
`;

const Div = styled.div``;

const ImgDiv = styled.div`
  background-color: whitesmoke;
  border-radius: 10px;
`;
