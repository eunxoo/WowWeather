import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "./Sidebar";
import moment from "moment-timezone";

const Menubar = ({ userObj }) => {
  moment.tz.setDefault("Asia/Seoul");
  console.log(moment().hour());
  const nowHours = moment().hour();
  const [isShow, setIsShow] = useState(true);

  const controlNavbar = () => {
    if (window.scrollY > 0) {
      setIsShow(false);
    } else {
      setIsShow(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    window.addEventListener("wheel", controlNavbar);
    window.addEventListener("touchmove", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
      window.removeEventListener("wheel", controlNavbar);
      window.removeEventListener("touchmove", controlNavbar);
    };
  }, []);

  const showModal = (e) => {
    document.body.style.overflow = "hidden";
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleSide = () => {
    setIsOpen(true);
    showModal();
  };

  return (
    <Container hours={nowHours}>
      <MenuDiv onClick={toggleSide}></MenuDiv>
      <Wrap hours={nowHours} className={`nav ${!isShow && "navNone"}`}>
        <GiHamburgerMenu
          className={`hamburger ${!isShow && "hamburgerNone"}`}
          role="button"
        />
        <Navbar hours={nowHours}></Navbar>
      </Wrap>
      <Outlet />
      <Sidebar
        setIsShow={setIsShow}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        userObj={userObj}
        hours={nowHours}
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
  height: 6vh;
  width: 100%;
  position: fixed;
  top: 0;
  transition-timing-function: ease-in;
  transition: 0.3s;
`;
