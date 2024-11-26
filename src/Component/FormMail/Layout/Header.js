import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { api, useLogout } from "../../Api/Api";
import dayjs from "dayjs";

function Header() {
  const [openHeader, setOpenHeader] = useState(false);
  const thisLocation = useLocation();
  const login = useSelector(state => state.user);
  const navi = useNavigate();

  useEffect(() => {
    const pathsToHideHeader = [
      "/surveya",
      "/surveyb",
      "/surveyc",
      "/join",
      "/regist",
    ];
    if (
      thisLocation.pathname === "/formmail" ||
      pathsToHideHeader.includes(thisLocation.pathname)
    ) {
      setOpenHeader(false);
    } else {
      setOpenHeader(true); // 이 부분은 사실 불필요하므로 제거할 수 있음
    }
  }, [thisLocation]);

  useEffect(() => {
    console.log(login);
    if (login && login.userName !== "") {
      if (login.role !== "user") {
        loginChk();
      } else {
        navi("/");
      }
    }
    //eslint-disable-next-line
  }, [thisLocation, login]);

  const handleLogout = useLogout();

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
      console.log(refresh);
    }
  };

  const goMyPage = () => {
    navi("/formmail/admin/mypage");
  };
  return (
    <>
      {openHeader && (
        <div className="lg:ml-[220px] flex justify-start gap-x-4">
          <div className="p-3">{login.userName}님 안녕하세요</div>
          <button
            className="p-2 text-blue-500 hover:text-blue-700 hover:font-bold"
            onClick={goMyPage}
          >
            정보수정하기
          </button>
          <button
            className="p-2 text-rose-500 hover:text-rose-700 hover:font-bold"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        </div>
      )}
    </>
  );
}

export default Header;
