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

function App() {
  const thisLocation = useLocation();
  const login = useSelector(state => state.user);
  const navi = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(login);
    if (login.userId) {
      navi("/admin");
    } else {
      dispatch(clearUser());
      navi("/");
    }
    //eslint-disable-next-line
  }, [thisLocation]);
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
