import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminMain from "./Pages/AdminMain";
import Header from "./Components/Header";
import Login from "./Pages/Login";
import AdInput from "./Pages/AdInput";
import AdList from "./Pages/AdList";
import Test from "./Pages/Test";

import dayjs from "dayjs";
import AdInput2 from "./Pages/AdInput2";
import { api, useLogout } from "./Api/Api";
import Clock from "./Components/Clock";
import Modal from "./Components/Modal";

function App() {
  const logout = useLogout();
  const [time, setTime] = useState(dayjs().format("HH:mm:ss")); // 초 단위 시간 상태
  const thisLocation = useLocation();
  const login = useSelector(state => state.user);
  const navi = useNavigate();

  const [limit, setLimit] = useState(999);
  const [modalOn, setModalOn] = useState();
  const [modalType, setModalType] = useState("");
  useEffect(() => {
    if (thisLocation.pathname === "/" && login.userId) {
      navi("/admin");
    } else if (!login.userId && thisLocation.pathname !== "/") {
      navi("/");
    }
    if (login.userId) {
      if (limit > 0 && limit < 60) {
        extendLogin();
      }
      getLimit();
    }
    // eslint-disable-next-line
  }, [thisLocation.pathname, login.userId]);

  const extendLogin = async () => {
    const res = await api
      .get("/api/v1/jobsite/common/reissu/AccessToken")
      .json();
    if (res.code === "C000") {
      getLimit();
    } else {
      logout();
    }
  };

  const getLimit = async () => {
    const res = await api.get("/api/v1/jobsite/common/exper_cookie").json();
    setLimit(res.limit);
  };

  useEffect(() => {
    const updateTime = () => {
      setTime(dayjs().format("HH:mm:ss")); // 초 단위로 시간 업데이트
      setLimit(prevLimit => (prevLimit > 0 ? prevLimit - 1 : prevLimit)); // 최신 상태 참조
    };

    const interval = setInterval(updateTime, 1000); // 1초마다 실행

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리

    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (limit < 31 && limit > 0) {
      setModalOn(true);
      setModalType("limit");
    } else {
      setModalOn(false);
      setModalType("");
    }
    if (limit < 1) {
      if (login.userId) {
        extendLogin();
      }
    }
    //eslint-disable-next-line
  }, [limit]);

  return (
    <>
      <Header thisLocation={thisLocation} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test" element={<Test />} />
        <Route path="/admin" element={<AdminMain />}>
          <Route path="" element={<AdList />} />
          <Route path="adinput" element={<AdInput />} />
          <Route path="adinput2" element={<AdInput2 />} />
          <Route path="adlist" element={<AdList />} />
        </Route>
      </Routes>
      {thisLocation.pathname !== "/" && <Clock time={time} />}
      {thisLocation.pathname !== "/" && (
        <Modal
          modalOn={modalOn}
          setModalOn={setModalOn}
          modalType={modalType}
          setModalType={setModalType}
          limit={limit}
          setLimit={setLimit}
          extendLogin={extendLogin}
        />
      )}
    </>
  );
}

export default App;
