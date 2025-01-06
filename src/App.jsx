import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminMain from "./Pages/AdminMain";
import Header from "./Components/Header";
import Login from "./Pages/Login";
import AdInput from "./Pages/AdInput";
import AdList from "./Pages/AdList";
import Test from "./Pages/Test";
import { loginUser, clearUser } from "./Reducer/userSlice";
import dayjs from "dayjs";

function App() {
  const thisLocation = useLocation();
  const login = useSelector(state => state.user);
  const navi = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (thisLocation.pathname === "/" && login.userId) {
      navi("/admin");
    } else if (!login.userId && thisLocation.pathname !== "/") {
      navi("/");
    }
    if (login.userId && isOverDay(login.lastLogin)) {
      alert("로그인 후 오랜시간 페이지를 이동하지 않으면 로그아웃 됩니다");
      dispatch(clearUser());
    } else {
      dispatch(
        loginUser({
          lastLogin: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss"),
        })
      );
    }
    // eslint-disable-next-line
  }, [thisLocation.pathname, login.userId]);

  const isOverDay = lastLogin => {
    if (!lastLogin) return true;
    const now = dayjs();
    const lastLoginDate = dayjs(lastLogin);
    return now.diff(lastLoginDate, "hour") >= 10;
  };

  return (
    <>
      <Header thisLocation={thisLocation} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test" element={<Test />} />
        <Route path="/admin" element={<AdminMain />}>
          <Route path="" element={<AdList />} />
          <Route path="adinput" element={<AdInput />} />
          <Route path="adlist" element={<AdList />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
