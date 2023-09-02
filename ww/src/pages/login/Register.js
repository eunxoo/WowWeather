import React, { useState } from "react";
import {
  firebaseAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from "../../fbase";
import styled from "styled-components";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errorMsg1, setErrorMsg1] = useState(" ");
  const [errorMsg2, setErrorMsg2] = useState(" ");
  const [errorMsg3, setErrorMsg3] = useState(" ");
  const [isName, setIsName] = useState(true);

  const navigate = useNavigate();

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setRegisterEmail(value);
    } else if (name === "password") {
      setRegisterPassword(value);
    } else if (name === "displayName") {
      setDisplayName(value);
    }
  };

  const signup = async () => {
    try {
      setErrorMsg1(" ");
      setErrorMsg2(" ");
      setErrorMsg3(" ");
      if (displayName === " ") {
        setIsName(false);
      }
      const createdUser = await createUserWithEmailAndPassword(
        firebaseAuth,
        registerEmail,
        registerPassword
      );
      await sendEmailVerification(firebaseAuth.currentUser);
      alert("회원가입이 완료되었습니다! 이메일을 확인해주세요.");
      console.log(createdUser);
      setRegisterEmail("");
      setRegisterPassword("");
      setDisplayName("");
      await updateProfile(firebaseAuth.currentUser, {
        displayName: displayName,
      });
      window.location.replace("/");
    } catch (err) {
      console.log(err.code);
      // setIsError(true);
      switch (err.code) {
        case "auth/weak-password":
          setErrorMsg2("* 비밀번호는 6자리 이상이어야 합니다.");
          break;
        case "auth/invalid-email":
          setErrorMsg1("* 잘못된 이메일 주소입니다.");
          break;
        case "auth/email-already-in-use":
          setErrorMsg3("* 이미 가입되어 있는 계정입니다.");
          break;
        default:
          break;
      }
    }
  };

  return (
    <Out>
      <Container>
        <Wrap>
          <Header>
            <FaArrowLeft className="arrow" onClick={() => navigate("/")} />
          </Header>
          <Box>
            <SemiBox>
              <AText>이메일</AText>
              {errorMsg1 === " " ? (
                <AInput
                  name="email"
                  value={registerEmail}
                  placeholder="이메일을 입력해주세요"
                  onChange={onChange}
                ></AInput>
              ) : (
                <ErrorInput
                  name="email"
                  value={registerEmail}
                  placeholder="이메일을 입력해주세요"
                  onChange={onChange}
                ></ErrorInput>
              )}
              <ErrMsg1>{errorMsg1}</ErrMsg1>
            </SemiBox>
            <SemiBox>
              <AText>비밀번호 (6자리 이상 입력해주세요.) </AText>
              {errorMsg2 === " " ? (
                <AInput
                  name="password"
                  value={registerPassword}
                  placeholder="비밀번호를 입력해주세요"
                  onChange={onChange}
                ></AInput>
              ) : (
                <ErrorInput
                  name="password"
                  value={registerPassword}
                  placeholder="비밀번호를 입력해주세요"
                  onChange={onChange}
                ></ErrorInput>
              )}
              <ErrMsg2>{errorMsg2}</ErrMsg2>
            </SemiBox>
            <SemiBox>
              <AText>닉네임</AText>
              {isName ? (
                <AInput
                  name="displayName"
                  value={displayName}
                  placeholder="닉네임을 입력해주세요"
                  onChange={onChange}
                ></AInput>
              ) : (
                <ErrorInput
                  name="displayName"
                  value={displayName}
                  placeholder="닉네임을 입력해주세요"
                  onChange={onChange}
                ></ErrorInput>
              )}
            </SemiBox>
            <BtnBox>
              {!registerEmail || !registerPassword || !displayName ? (
                <InvalidBtn>회원가입</InvalidBtn>
              ) : (
                <ValidBtn onClick={signup}>회원가입</ValidBtn>
              )}

              <ErrMsg3>{errorMsg3}</ErrMsg3>
            </BtnBox>
          </Box>
        </Wrap>
      </Container>
    </Out>
  );
};

export default Register;

const Out = styled.div`
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
  .arrow {
    position: absolute;
  }
`;

const Wrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.header`
  position: fixed;
  top: -22vh;
  left: 4vw;
  .arrow {
    position: absolute;
    font-size: 3vh;
    color: #31b5ff;
  }
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  /* align-content: space-around; */
  /* justify-content: center; */

  height: auto;
`;
const SemiBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;

const AText = styled.div`
  margin-bottom: 2vh;
  font-size: 1.5vh;
`;

const ErrorInput = styled.input`
  border: 1px solid red;
  border-radius: 10px;
  outline: none;
  height: 5vh;
  width: 70vw;
  margin-bottom: 6vh;

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

const AInput = styled.input`
  border: 1px solid #31b5ff;
  border-radius: 10px;
  outline: none;
  height: 5vh;
  width: 70vw;
  margin-bottom: 6vh;

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

const ErrMsg1 = styled.div`
  position: absolute;
  top: 11vh;
  color: red;
`;

const ErrMsg2 = styled.div`
  position: absolute;
  top: 11vh;
  color: red;
`;

const ErrMsg3 = styled.div`
  position: absolute;
  top: 11vh;
  color: red;
`;

const BtnBox = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const InvalidBtn = styled.div`
  border: 2px solid #e6e6e6;
  background-color: #e6e6e6;
  padding: 0.5vh 3vw;
  border-radius: 10px;
  width: 70%;
  height: 4vh;
  text-align: center;
  line-height: 4vh;
  font-weight: bold;
`;

const ValidBtn = styled.div`
  border: 2px solid #31b5ff;
  background-color: #31b5ff;
  padding: 0.5vh 3vw;
  border-radius: 10px;
  width: 70%;
  height: 4vh;
  text-align: center;
  line-height: 4vh;
  font-weight: bold;
`;
