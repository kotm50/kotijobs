import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Main() {
  const thisLocation = useLocation();
  const navi = useNavigate();

  useEffect(() => {
    // 현재 URL이 /job이면 /job/list로 리다이렉트
    if (thisLocation.pathname === "/") {
      navi("/job/list");
    }
  }, [thisLocation, navi]);
  return <>잠시만 기다려 주십시오</>;
}

export default Main;
