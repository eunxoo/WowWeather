import React from "react";
import { Outlet } from "react-router-dom";

const Menubar = () => {
  return (
    <div>
      ㅎ<Outlet />
    </div>
  );
};

export default Menubar;
