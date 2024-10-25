import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, loginUser } from "../../../Reducer/userSlice";
import { useLocation, useNavigate } from "react-router-dom";

function Header() {
  const [openHeader, setOpenHeader] = useState(false);
  const thisLocation = useLocation();
  const login = useSelector(state => state.user);
  const navi = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(thisLocation.pathname);
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
    if (login.userId === "") {
      dispatch(clearUser()); // Redux 상태 초기화
      if (thisLocation.pathname !== "/formmail") {
        navi("/formmail");
      }
    } else {
      const now = new Date();
      if (!login.lastLogin) {
        dispatch(loginUser({ lastLogin: now }));
      } else {
        const lastLogin = new Date(login.lastLogin);
        const timeDiff = now - lastLogin; // 밀리초 단위로 차이 계산
        const timeLimit = 1000 * 60 * 120; // 2시간(3600000ms)
        const warningLimit = 1000 * 60 * 50; // 50분(3000000ms)

        if (timeDiff > timeLimit) {
          // 1시간이 지나면 로그아웃 처리
          dispatch(clearUser());
        } else if (timeDiff > warningLimit) {
          // 50분 이상 경과한 경우 로그인 시간 갱신
          dispatch(loginUser({ lastLogin: now }));
        }
        // 그 외의 경우에는 아무것도 하지 않음
      }
    }
    //eslint-disable-next-line
  }, [thisLocation]);
  const handleLogout = async () => {
    try {
      dispatch(clearUser()); // Redux 상태 초기화
      if (thisLocation.pathname !== "/formmail") {
        navi("/formmail"); // 로그아웃 후 홈 화면으로 리디렉션
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
      // 오류 처리 로직 추가 가능
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
