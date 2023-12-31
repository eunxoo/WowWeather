import React, { useEffect, useRef } from "react";
import { MdClose, MdNavigateNext } from "react-icons/md";
import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { firebaseAuth, signOut } from "../../fbase";

const Sidebar = ({ isOpen, setIsOpen, userObj, hours }) => {
  const location = useLocation();

  useEffect(() => {
    document.addEventListener("mousedown", handlerOutside);
    return () => {
      document.removeEventListener("mousedown", handlerOutside);
    };
  }, []);
  const toggleSide = () => {
    setIsOpen(false);
    hideModal();
  };

  const outside = useRef();
  const handlerOutside = (e) => {
    if (!outside.current.contains(e.target)) {
      toggleSide();
      hideModal();
    }
  };

  const hideModal = (e) => {
    document.body.style.overflow = "unset";
  };

  const logout = async () => {
    await signOut(firebaseAuth);
    window.location.replace("/");
  };

  const dn = userObj.displayName;
  // console.log(typeof dn);
  let dname = "";
  if (dn.length >= 4) {
    dname = dn[0] + dn[1] + dn[2] + dn[3] + ".. ";
  } else {
    dname = dn;
  }

  return (
    <>
      <Div hours={hours}></Div>
      <Container className={isOpen ? "open" : ""} ref={outside} hours={hours}>
        <Box>{dname + " 님, 안녕하세요!"}</Box>
        <CloseDiv hours={hours}>
          <MdClose className="close" onClick={toggleSide} />
        </CloseDiv>
        <ul className="ul">
          <Menu $isActive={location.pathname === "/"} hours={hours}>
            <MdNavigateNext className="in" />
            <Link className="link" to="/" onClick={toggleSide}>
              홈
            </Link>
          </Menu>
          <Menu $isActive={location.pathname === "/checklist"} hours={hours}>
            <MdNavigateNext className="in" />
            <Link className="link" to="/checklist" onClick={toggleSide}>
              체크리스트
            </Link>
          </Menu>
        </ul>
        <SignOut onClick={logout}>로그아웃</SignOut>
      </Container>
    </>
  );
};

export default Sidebar;

const Div = styled.div`
  position: absolute;
  top: 0;
  width: 100vw;
  height: 6.2vh;
  background-color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "black"
      : "white";
  }};
  z-index: -5;
`;

const Container = styled.div`
  z-index: 5;
  position: fixed;
  left: -65%;
  top: 0;
  height: 100%;
  width: 60%;
  background-color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "white"
      : "black";
  }};
  color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "black"
      : "white";
  }};
  padding: 2%;
  transition: 0.5s ease;

  &.open {
    left: 0;
    top: 0;
    transition: 0.5s ease;
    height: 100%;
  }

  .ul {
    list-style: none;
    padding-left: 0;
    margin: 10vh 0.5vw;
  }
`;
const Menu = styled.li`
  .link {
    text-decoration-line: none;
    color: ${({ hours }) => {
      return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
        ? "black"
        : "white";
    }};
    list-style: none;
  }

  margin-bottom: 3vh;
  margin-left: ${(props) =>
    props.$isActive ? "4vw" : "0"}; // 주소가 일치할 때만 들여쓰기를 적용
  /* transition: padding-left 0.3s ease-in-out; */

  /* &:hover {
    margin-left: 3vw; // 마우스 호버시 들여쓰기 적용
  } */

  .in {
    position: relative;
    top: 2px;
  }
`;

const CloseDiv = styled.div`
  z-index: 10;
  position: relative;
  left: 85%;
  .close {
    font-size: 4vh;
    color: ${({ hours }) => {
      return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
        ? "black"
        : "white";
    }};
  }
`;

const SignOut = styled.div`
  position: absolute;
  bottom: 7vh;
  left: 3vw;
  border: 1px solid black;
  border-radius: 10px;
  background-color: white;
  padding: 1vh 1vw;
  color: black;
`;
const Box = styled.div`
  position: absolute;
  margin-left: 0vw;
  padding-left: 0vw;
  top: 2vh;
  font-size: 2vh;
  width: 100vw;
`;

const Wrap = styled.div`
  position: absolute;
  top: 2vh;
  display: flex;
  flex-direction: row;
`;
