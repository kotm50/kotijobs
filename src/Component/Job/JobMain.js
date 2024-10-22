import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

function JobMain() {
  const thisLocation = useLocation();
  const navi = useNavigate();

  useEffect(() => {
    // 현재 URL이 /job이면 /job/list로 리다이렉트
    if (thisLocation.pathname === "/job") {
      navi("/job/list");
    }
  }, [thisLocation, navi]);
  return (
    <>
      <Outlet />
    </>
  );
}

export default JobMain;
