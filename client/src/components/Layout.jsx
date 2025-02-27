import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import "../styles/layout.scss";

const RootLayout = () => {
  return (
    <div className="layoutContainer">
      <div className="layout__header">
        <Navbar />
      </div>
      <div className="layout__outlet">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
