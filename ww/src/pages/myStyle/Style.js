import React from "react";
import styled from "styled-components";

const Style = () => {
  const nowHours = new Date().getHours();
  return (
    <Container hours={nowHours}>
      <div>스타일</div>
    </Container>
  );
};

export default Style;

const Container = styled.div`
  color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "white"
      : "black";
  }};
`;
