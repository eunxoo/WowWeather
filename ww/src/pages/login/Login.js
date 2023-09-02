import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PiDotsThreeVertical } from "react-icons/pi";
import { MdClose } from "react-icons/md";
import GoogleLogin from "../../components/login/GoogleLogin";
import {
  firebaseAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "../../fbase";

const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [email, setEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // onAuthStateChanged(firebaseAuth, (currentUser) => {
  //   setUser(currentUser);
  // });
  const navigate = useNavigate();
  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        firebaseAuth,
        loginEmail,
        loginPassword
      );
      console.log(user);
      if (!user.user.emailVerified) {
        alert("이메일 인증을 해주세요.");
      } else {
        window.location.replace("/");
      }
    } catch (error) {
      console.log(error.message);
      alert("이메일 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const showModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const findPassword = async () => {
    try {
      console.log(email);
      await sendPasswordResetEmail(firebaseAuth, email);
      alert("비밀번호 재설정 이메일이 전송되었습니다. 이메일을 확인하세요.");
      window.location.replace("/");
    } catch (error) {
      console.error(error.message);
      alert("비밀번호 재설정 이메일을 보낼 수 없습니다. 이메일을 확인하세요.");
    }
  };

  const onCheckEnter = (e) => {
    if (e.key === "Enter") {
      signIn();
    }
  };

  return (
    <Wrap>
      <Container>
        <LogoImg src={"/images/logo/wowstop.gif"} />
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
            onKeyPress={onCheckEnter}
          />
          <LoginBtn onClick={signIn}>로그인</LoginBtn>
        </Box>
        <Boxx>
          <SearchPassWord onClick={showModal}>비밀번호 찾기</SearchPassWord>
          {modalOpen && (
            <>
              <Modal>
                <MdCloseB onClick={closeModal} />
                <Content>
                  <EmailInput
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    placeholder="이메일을 입력하세요."
                  />
                  <SubButton onClick={findPassword}>찾기</SubButton>
                </Content>
              </Modal>
            </>
          )}
          <BarContainer>
            <PiDotsThreeVertical className="bar" />
          </BarContainer>
          <RegisterDiv onClick={() => navigate("/register")}>
            회원가입
          </RegisterDiv>
        </Boxx>
        <GoogleLogin />
      </Container>
    </Wrap>
  );
};

export default Login;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

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
  height: auto;
`;

const LogoImg = styled.img`
  height: 250px;
  margin-top: -100px;
  margin-bottom: -10px;
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

const Modal = styled.div`
  width: 90vw;
  height: 30vh;

  /* 최상단 위치 */
  z-index: 999;

  /* 중앙 배치 */
  /* top, bottom, left, right 는 브라우저 기준으로 작동한다. */
  /* translate는 본인의 크기 기준으로 작동한다. */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -90%);

  /* 모달창 디자인 */
  background-color: white;
  border: 3px solid black;
  border-radius: 30px;
`;

const MdCloseB = styled(MdClose)`
  position: absolute;
  font-size: 4vh;
  top: 2vh;
  right: 3vw;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const EmailInput = styled.input`
  border: 1px solid black;
  border-radius: 10px;
  outline: none;
  height: 5vh;
  width: 230px;
  margin: 7vh auto;
  font-size: 15px;
  &::placeholder {
    padding-left: 10px;
  }

  &:focus {
    /* color: #363636; */
    border: 2px solid black;
  }
`;

const SubButton = styled.button`
  width: 16vw;
  border: 2px solid black;
  position: absolute;
  bottom: 3vh;
  right: 3vw;
  height: 3vh;
  font-size: 1.5vh;
  border-radius: 10px;

  &:focus {
    background-color: black;
    color: white;
  }
`;

const RegisterDiv = styled.div`
  position: absolute;
  left: 300%;
  width: max-content;
  font-size: 0.8rem;
`;
