import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PiDotsThreeVertical } from "react-icons/pi";
import GoogleLogin from "./GoogleLogin";
import { firebaseAuth, signInWithEmailAndPassword } from "../../fbase";
import { onAuthStateChanged } from "@firebase/auth";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState({});
  // onAuthStateChanged(firebaseAuth, (currentUser) => {
  //   setUser(currentUser);
  // });
  const navigate = useNavigate();
  const signIn = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(
        firebaseAuth,
        loginEmail,
        loginPassword
      );
      console.log(user);
      setUser(user.user);
      window.location.replace("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  // const logout = async () => {
  //   await signOut(firebaseAuth);
  // };

  return (
    <Container>
      <Box>
        <InputEmail
          type="email"
          value={loginEmail}
          onChange={(e) => {
            setLoginEmail(e.target.value);
          }}
          placeholder="이메일"
        />
        <InputPw
          type="password"
          value={loginPassword}
          onChange={(e) => {
            setLoginPassword(e.target.value);
          }}
          placeholder="비밀번호"
        />
        <LoginBtn onClick={signIn}>로그인</LoginBtn>
      </Box>
      <Boxx>
        <SearchPassWord>비밀번호 찾기</SearchPassWord>
        <BarContainer>
          <PiDotsThreeVertical className="bar" />
        </BarContainer>
        <RegisterDiv onClick={() => navigate("/register")}>
          회원가입
        </RegisterDiv>
      </Boxx>
      <GoogleLogin />
    </Container>
  );
};

export default Login;

const Container = styled.div`
  position: relative;
  top: calc(var(--vh, 1vh) * 50);
  transform: translateY(-50%);
  width: 100%;
  /* max-height: 50vh; */
  /* max-width: 50vh; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
`;
const Box = styled.div`
  display: flex;
  flex-direction: column;
  /* align-content: space-around; */
  /* justify-content: center; */

  height: auto;
`;
const InputEmail = styled.input`
  /* background-color: transparent; */
  border: 1px solid #31b5ff;
  border-radius: 10px;
  outline: none;
  height: 5vh;
  width: 70vw;
  margin-bottom: 3vh;

  &::placeholder {
    padding-left: 10px;
  }

  /* &:hover {
    border: 2px solid grey;
  } */

  &:focus {
    /* color: #363636; */
    border: 3px solid #31b5ff;
  }
`;
const InputPw = styled.input`
  border: 1px solid #31b5ff;
  border-radius: 10px;
  outline: none;
  height: 5vh;
  width: 70vw;
  margin-bottom: 3vh;

  &::placeholder {
    padding-left: 10px;
  }

  /* &:hover {
    border: 2px solid grey;
  } */

  &:focus {
    /* color: #363636; */
    border: 3px solid #31b5ff;
  }
`;
const LoginBtn = styled.button`
  background-color: #31b5ff;
  border: 1px solid #31b5ff;
  border-radius: 10px;
  /* outline: none; */
  height: 5vh;
  /* width: 70vw; */
  margin-bottom: 3vh;
  color: whitesmoke;

  &:hover {
    border: 2px solid #31b5ff;
    background-color: white;
    color: #31b5ff;
  }

  &:active {
    border: 2px solid #31b5ff;
    background-color: white;
    color: #31b5ff;
  }
`;
const Boxx = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 3vh;
  /* padding: auto; */
  /* transform: translate(0, 0); */

  /* .bar {
    position: absolute;
    left: 50%;
  } */
`;

const BarContainer = styled.div`
  position: relative;
  font-size: 0.9rem;
`;

const SearchPassWord = styled.div`
  position: absolute;
  right: 300%;
  width: max-content;
  font-size: 0.8rem;
`;

const RegisterDiv = styled.div`
  position: absolute;
  left: 300%;
  width: max-content;
  font-size: 0.8rem;
`;
