import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "./Sidebar";

const Menubar = ({ userObj }) => {
  const [isShow, setIsShow] = useState(false);
  const nowHours = new Date().getHours();

  const controlNavbar = () => {
    if (window.scrollY > 30) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, []);

  const showModal = (e) => {
    document.body.style.overflow = "hidden";
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleSide = () => {
    setIsOpen(true);
    setIsShow(true);
    showModal();
  };
  return (
    <Container hours={nowHours}>
      <MenuDiv onClick={toggleSide}></MenuDiv>
      <Wrap hours={nowHours}>
        <GiHamburgerMenu
          className={`hamburger ${isShow && "hamburgerNone"}`}
          role="button"
        />
        <Navbar
          hours={nowHours}
          className={`nav ${isShow && "navNone"}`}
        ></Navbar>
      </Wrap>
      <Outlet />
      <Sidebar
        setIsShow={setIsShow}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userObj={userObj}
      />
    </Container>
  );
};

export default React.memo(Menubar);

const Container = styled.div`
  position: relative;
  .navNone {
    height: 30px;
    width: 100%;
    display: none;
    visibility: none;
    opacity: 1;
  }
`;

const MenuDiv = styled.button`
  position: absolute;
  top: 1vh;
  left: 3vw;
  height: 4vh;
  width: 4vh;
  z-index: 9;
  opacity: 0;
`;

const Wrap = styled.div`
  height: 5vh;
  width: 100%;
  position: fixed;
  top: 0;
  padding-bottom: 1vh;
  transition-timing-function: ease-in;
  transition: 0.3s;

  .hamburger {
    position: absolute;
    top: 1vh;
    left: 3vw;
    font-size: 4vh;
    z-index: 4;

    color: ${({ hours }) => {
      return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
        ? "white"
        : "black";
    }};
  }

  .hamburgerNone {
    display: none;
    z-index: 5;
  }
`;

const Navbar = styled.div`
  background-color: ${({ hours }) => {
    return (hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 4)
      ? "black"
      : "white";
  }};
  /* opacity: 0.5; */
  height: 5vh;
  width: 100%;
  position: fixed;
  top: 0;
  padding-bottom: 3vh; // 수정해야할 수도 있음.. 낮에 확인해보기
  transition-timing-function: ease-in;
  transition: 0.3s;
`;
