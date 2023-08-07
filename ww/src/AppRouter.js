import React from "react";
import Weather from "./pages/main/Weather";
import CheckList from "./pages/checkList/CheckList";
import Style from "./pages/myStyle/Style";
import Login from "./pages/login/Login";
import Register from "./pages/login/Register";
import { Redirect, Route, Routes } from "react-router-dom";
import Menubar from "./components/Menubar";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
  console.log(isLoggedIn);
  console.log(userObj);
  return (
    <Routes>
      {isLoggedIn ? (
        <>
          <Route path="/" element={<Menubar userObj={userObj} />}>
            <Route exact path="/" element={<Weather />} />

            <Route path="/checkList" element={<CheckList />} />

            <Route path="/myStyle" element={<Style />} />
          </Route>
        </>
      ) : (
        <>
          <Route
            path="/"
            element={<Login userObj={userObj} refreshUser={refreshUser} />}
          />
          <Route path="/register" element={<Register userObj={userObj} />} />
        </>
      )}
    </Routes>
  );
};

export default AppRouter;
