import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "./Sidebar";

const Menubar = ({ userObj }) => {
  const [isShow, setIsShow] = useState(false);

  const controlNavbar = () => {
    if (window.scrollY > 50) {
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
    <Container>
      <Wrap>
        <Navbar className={`nav ${isShow && "navNone"}`}></Navbar>
        <GiHamburgerMenu
          className={`hamburger ${isShow && "hamburgerNone"}`}
          role="button"
          onClick={toggleSide}
        />
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

export default Menubar;

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

const Wrap = styled.div`
  height: 5vh;
  width: 100%;
  position: fixed;
  top: 0;
  padding-bottom: 1vh;
  transition-timing-function: ease-in;
  transition: 0.5s;

  .hamburger {
    position: absolute;
    top: 1vh;
    left: 3vw;
    font-size: 4vh;
    z-index: 5;
  }

  .hamburgerNone {
    display: none;
  }
`;

const Navbar = styled.div`
  background-color: #c2e9ff;
  opacity: 0.5;
  height: 5vh;
  width: 100%;
  position: fixed;
  top: 0;
  padding-bottom: 1vh;
  transition-timing-function: ease-in;
  transition: 0.5s;
`;
