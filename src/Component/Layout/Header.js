import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { api, useLogout } from "../Api/Api";
import dayjs from "dayjs";

function Header() {
  const thisLocation = useLocation();
  const login = useSelector(state => state.user);

  useEffect(() => {
    console.log(login);
    if (login && login.userName !== "") {
      loginChk();
    }
    //eslint-disable-next-line
  }, [thisLocation, login]);

  const timeChk = () => {
    const now = new Date();
    const day = Number(dayjs(now).format("DD"));
    const hour = Number(dayjs(now).format("hh"));
    const min = Number(dayjs(now).format("mm"));
    let hourDiff = 0;
    console.log(login.lastLogin);
    console.log({ day, hour, min });
    if (day !== login.lastLogin.day) {
      return 50;
    }
    if (login.lastLogin.hour > hour) {
      let formattedHour = hour + 12;
      hourDiff = formattedHour - login.lastLogin.hour;
    } else {
      hourDiff = hour - login.lastLogin.hour;
    }
    const minDiff = min + hourDiff * 60 - login.lastLogin.min;
    return minDiff;
  };

  const loginChk = async () => {
    if (!login) {
      return false;
    }
    const time = timeChk();
    console.log(time);
    if (time < 50) {
      return false;
    }
    const res = await api.get("/api/v1/formMail_admin/exper_cookie").json();
    console.log(res);
    if (res.code === "E004") {
      handleLogout();
    }
    if (Number(res.limit) < 601) {
      const refresh = await api
        .get("/api/v1/formMail_admin/reissu/AccessToken")
        .json();
      if (refresh.code === "E403") {
        handleLogout();
      }
    }
  };

  const handleLogout = useLogout();
  return (
    <div className="bg-white drop-shadow w-full">
      <h1 className="max-w-[1200px] mx-auto p-4 w-full flex justify-between">
        <Link
          to={"/"}
          className="text-center text-xl font-neoextra text-teal-600 hover:text-rose-500"
        >
          코리아티엠 Job Portal Alpha
        </Link>
        {login.userId ? (
          <div id="userInfo" className="flex flex-end gap-x-2 text-center">
            <Link to={"/"} onClick={e => e.preventDefault()}>
              <span className="font-bold">{login.userName}</span>님 안녕하세요
            </Link>
            <Link to={"/mypage"}>마이코티</Link>
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-2">
            <Link to="/login">로그인</Link>
            <Link to="/join">회원가입</Link>
          </div>
        )}
      </h1>
    </div>
  );
}

export default Header;
