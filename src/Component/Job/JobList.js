import React, { useEffect, useState } from "react";
import { baseUrl } from "../Api/Api";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import Pagenation from "../Layout/Pagenation";
import ImgLoader from "../Image/ImgLoader";
import { api } from "../Api/Api";

function JobList() {
  const thisLocation = useLocation();
  const parsed = queryString.parse(thisLocation.search);
  const page = Number(parsed.page) || 1;
  const size = Number(parsed.size) || 20;
  const [jobs, setJobs] = useState([]); // 단일 파일을 저장할 상태
  const [last, setLast] = useState(1);

  useEffect(() => {
    getJobs();
    //eslint-disable-next-line
  }, []);

  const getJobs = async () => {
    //console.log(process.env.REACT_APP_API_URL);
    const data = {
      page: page,
      size: size,
    };
    //console.log(data);
    try {
      //const res1 = await ky.get("/api/v1/formMail_ad/jobSiteListTest").json();
      const res = await api
        .post("/api/v1/formMail_ad/allJobsiteList", { json: data })
        .json();

      //console.log("겟", res);
      //console.log("포스트", res1);

      const jobSiteList = res.jobSiteList;
      let testList = [];

      for (let i = 0; i < 6; i++) {
        testList.push(jobSiteList[0]);
      }
      setLast(res.totalPages || 1);
      //setJobs(res.jobSiteList || []);
      setJobs(testList || []);
    } catch (error) {
      console.error("Error fetching company list: ", error);
    }
  };
  return (
    <>
      <div className="w-full">
        {jobs && jobs.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full px-2 lg:px-0">
              {jobs.map((job, idx) => (
                <Link
                  to={`/job/detail?aid=${job.aid}`}
                  key={idx}
                  className="px-4 py-2 bg-white dark:bg-white border rounded-lg w-full flex flex-col justify-start hover:bg-rose-50 jobList shadow hover:shadow-lg"
                >
                  <div className="max-w-[100px] h-[40px] lg:max-w-[200px] lg:h-[80px] mx-auto overflow-hidden relative mb-2 dark:bg-white">
                    <ImgLoader
                      image={`${baseUrl}${job.logoImg}`}
                      altText={job.title}
                      tag={"max-w-full h-auto my-auto"}
                    />
                  </div>
                  <div className="text-base font-bold">{job.title}</div>
                  <div className="text-sm text-nowrap text-ellipsis mb-2">
                    {job.company}
                  </div>
                  <div className="text-base">
                    주{" "}
                    <span className="text-rose-500 font-bold">
                      {job.workDay.split(", ").length}
                    </span>{" "}
                    일 근무
                  </div>
                  <div className="text-base">
                    월 최대{" "}
                    <span className="text-rose-500 font-bold">
                      {Number(job.maxPay).toLocaleString()}
                    </span>{" "}
                    만원
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-12 h-12 text-gray-100 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          </div>
        )}
        {jobs && jobs.length > 0 ? (
          <Pagenation last={last} rootPath={"job/list"} />
        ) : null}
      </div>
    </>
  );
}

export default JobList;
