import { Routes, Route, useLocation } from "react-router-dom";
import AdminMain from "./Pages/AdminMain";
import Header from "./Components/Header";
import Login from "./Pages/Login";
import AdInput from "./Pages/AdInput";
import AdList from "./Pages/AdList";
import Test from "./Pages/Test";

function App() {
  const thisLocation = useLocation();
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
