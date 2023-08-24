import React, { useEffect, useState } from "react";
import { firebaseAuth } from "./fbase";
import AppRouter from "./AppRouter";
import styled from "styled-components";

const App = () => {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);
  useEffect(() => {
    firebaseAuth.onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        setIsLoggedIn(true);
        setUserObj({
          uid: user.uid,
          displayName: user.displayName,
          updateProfile: (args) => user.updateProfile(args),
        });
        if (user.displayName === null) {
          const name = user.email.split("@")[0];
          user.displayName = name;
        }
      } else {
        setIsLoggedIn(false);
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  const refreshUser = () => {
    const user = firebaseAuth.currentUser;
    setUserObj({
      uid: user.uid,
      displayName: user.displayName,
      updateProfile: (args) => user.updateProfile(args),
    });
  };
  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn}
          userObj={userObj}
        />
      ) : (
        <LogoImg src={"/images/logo/wowlogoreverse.gif"} />
      )}
      {/* <Footer>&copy; {new Date().getFullYear()} 앗!</Footer> */}
    </>
  );
};
export default App;

const LogoImg = styled.img`
  justify-content: center;
  justify-items: center;
  align-items: center;
  align-content: center;
  position: relative;
  top: calc(var(--vh, 1vh) * 50);
  transform: translateY(-50%);
  width: 100%;
  height: 250px;
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

const Footer = styled.div`
  margin-top: 3vh;
  /* position: relative; */
  /* transform: translateY(-100%); */
  font-size: 0.5vh;
`;
