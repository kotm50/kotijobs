import React from "react";
import { Outlet } from "react-router-dom";
import Menu from "../Layout/Menu";

function AdminMain() {
  return (
    <>
      <Menu />
      <div className="bg-[#fafbfc] lg:ml-[220px] py-4">
        <Outlet />
      </div>
    </>
  );
}

export default AdminMain;
