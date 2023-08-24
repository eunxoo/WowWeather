import React, { useState } from "react";
import styled from "styled-components";
import { firebaseAuth } from "../../fbase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

const GoogleLogin = () => {
  const [userData, setUserData] = useState(null);
  const onSocialClick = async () => {
    const provider = new GoogleAuthProvider(); // provider를 구글로 설정
    await signInWithPopup(firebaseAuth, provider) // popup을 이용한 signup
      .then((data) => {
        setUserData(data.user); // user data 설정
        console.log(data); // console로 들어온 데이터 표시
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Container>
      <FcGoogle />
      <GoogleBtn onClick={onSocialClick}>구글로 로그인 하기</GoogleBtn>
      {userData ? userData.displayName : null}
    </Container>
  );
};

export default GoogleLogin;

const Container = styled.div`
  border: 2px solid #31b5ff;
  padding: 0.5vh 3vw;
  border-radius: 10px;
  & svg {
    position: absolute;
  }
`;
const GoogleBtn = styled.div`
  color: black;
  margin-left: 6vw;
`;
