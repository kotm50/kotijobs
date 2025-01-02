import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminMain from "./Pages/AdminMain";
import Header from "./Components/Header";
import Login from "./Pages/Login";
import AdInput from "./Pages/AdInput";
import AdList from "./Pages/AdList";
import Test from "./Pages/Test";
import { clearUser } from "./Reducer/userSlice";
import dayjs from "dayjs";

function App() {
  const thisLocation = useLocation();
  const login = useSelector(state => state.user);
  const navi = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(login);
    if (login.userId) {
      if (!isOverDay(login.lastLogin)) {
        navi("/admin");
      } else {
        alert("로그인 한지 24시간이 지났습니다. 다시 로그인 해주세요");
        dispatch(clearUser());
        navi("/");
      }
    } else {
      dispatch(clearUser());
      navi("/");
    }
    //eslint-disable-next-line
  }, [thisLocation]);

  const isOverDay = lastLogin => {
    if (!lastLogin) return true;
    const now = dayjs();
    const lastLoginDate = dayjs(lastLogin);
    return now.diff(lastLoginDate, "hour") >= 24;
  };
  return (
    <>
      <Header thisLocation={thisLocation} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/test" element={<Test />} />
        <Route path="/admin" element={<AdminMain />}>
          <Route path="" element={<AdInput />} />
          <Route path="adinput" element={<AdInput />} />
          <Route path="adlist" element={<AdList />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
