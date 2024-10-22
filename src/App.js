import {
  Routes,
  Route,
  /* useNavigate, */
} from "react-router-dom";
//import Main from "./Component/Main";
import JobList from "./Component/Job/JobList";
import JobMain from "./Component/Job/JobMain";
import JobDetail from "./Component/Job/JobDetail";
import Apply from "./Component/Apply/Apply";
import Header from "./Component/Layout/Header";
import Footer from "./Component/Layout/Footer";

function App() {
  return (
    <>
      <Header />
      <div className="font-neo text-sm max-w-[1200px] mx-auto py-4 min-h-[800px]">
        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/job" element={<JobMain />}>
            <Route path="" element={<JobList />} />
            <Route path="list" element={<JobList />} />
            <Route path="detail" element={<JobDetail />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
