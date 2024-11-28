import {
  Routes,
  Route,
  useLocation,
  /* useNavigate, */
} from "react-router-dom";
//import Main from "./Component/Main";
import JobList from "./Component/Job/JobList";
import JobMain from "./Component/Job/JobMain";
import JobDetail from "./Component/Job/JobDetail";
import Apply from "./Component/Apply/Apply";
import Header from "./Component/Layout/Header";
import Footer from "./Component/Layout/Footer";
import Main from "./Component/Main";

import FormMailHeader from "./Component/FormMail/Layout/Header";
import FormLogin from "./Component/FormMail/FormLogin";
import FormMailMain from "./Component/FormMail/Main";
import FormMailIndex from "./Component/FormMail/FormMailIndex";
import AdminMain from "./Component/FormMail/Admin/AdminMain";
import AdminList from "./Component/FormMail/Admin/AdminList";
import Join from "./Component/User/Join";
import UserLogin from "./Component/User/UserLogin";
import MypageMain from "./Component/User/Mypage/MypageMain";
import MypageAuth from "./Component/User/Mypage/MypageAuth";
import MyInfo from "./Component/User/Mypage/Myinfo";
import Test from "./Component/Test";

import ChannelService from "./ChannelService";

function App() {
  //2. 설치하기
  ChannelService.loadScript();

  //3. 부트하기
  ChannelService.boot({
    pluginKey: "8b6e2d8d-2066-4a0b-abbe-8f447f61e639",
  });
  const thisLocation = useLocation();
  const isAdmin = thisLocation.pathname.includes("formmail");
  return (
    <>
      {isAdmin ? <FormMailHeader /> : <Header />}
      <div
        className={
          !isAdmin
            ? "font-neo text-sm max-w-[1200px] mx-auto pb-4 min-h-[800px]"
            : undefined
        }
      >
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/test" element={<Test />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/job" element={<JobMain />}>
            <Route path="" element={<JobList />} />
            <Route path="list" element={<JobList />} />
            <Route path="detail" element={<JobDetail />} />
          </Route>
          <Route path="/mypage" element={<MypageMain />}>
            <Route path="" element={<MypageAuth />} />
            <Route path="edit" element={<MyInfo />} />
          </Route>
          <Route path="/formmail" element={<FormMailIndex />}>
            <Route path="" element={<FormLogin />} />
            <Route path="main" element={<FormMailMain />} />
            <Route path="admin" element={<AdminMain />}>
              <Route path="" element={<AdminList />} />
              <Route path="list" element={<AdminList />} />
            </Route>
          </Route>
        </Routes>
      </div>
      {!isAdmin && <Footer />}
    </>
  );
}

export default App;
