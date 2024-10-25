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
import { useEffect, useState } from "react";

import FormMailHeader from "./Component/FormMail/Layout/Header";
import Login from "./Component/FormMail/Login";
import FormMailMain from "./Component/FormMail/FormMailMain";
import FormMailIndex from "./Component/FormMail/FormMailIndex";

function App() {
  const thisLocation = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (thisLocation.pathname.includes("formmail")) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [thisLocation]);
  return (
    <>
      {isAdmin ? <FormMailHeader /> : <Header />}
      <div className="font-neo text-sm max-w-[1200px] mx-auto pb-4 min-h-[800px]">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/job" element={<JobMain />}>
            <Route path="" element={<JobList />} />
            <Route path="list" element={<JobList />} />
            <Route path="detail" element={<JobDetail />} />
          </Route>
          <Route path="/formmail" element={<FormMailIndex />}>
            <Route path="" element={<Login />} />
            <Route path="main" element={<FormMailMain />} />
          </Route>
        </Routes>
      </div>
      {!isAdmin && <Footer />}
    </>
  );
}

export default App;
