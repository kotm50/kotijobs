import React, { useEffect, useState } from "react";
import { baseUrl } from "../Api/Api";
import { Link, useLocation } from "react-router-dom";
import queryString from "query-string";
import ImgLoader from "../Image/ImgLoader";
import { api } from "../Api/Api";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

function PlatinumJobs() {
  const thisLocation = useLocation();
  const parsed = queryString.parse(thisLocation.search);
  const page = Number(parsed.page) || 1;
  const size = Number(parsed.size) || 30;
  const [jobArray, setJobArray] = useState([]); // 단일 파일을 저장할 상태

  const [counter, setCounter] = useState(1);
  useEffect(() => {
    //console.log(jobArray);
  }, [jobArray]);

  useEffect(() => {
    getJobs();
    //eslint-disable-next-line
  }, [thisLocation]);

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

      for (let i = 0; i < 28; i++) {
        testList.push(jobSiteList[0]);
      }

      let jobs1 = [];
      let jobs2 = [];
      let jobs3 = [];
      let jobs4 = [];
      let jobs5 = [];
      let jobArrays = [jobs1, jobs2, jobs3, jobs4, jobs5];

      for (let i = 0; i < testList.length; i++) {
        const arrayIndex = Math.floor(i / 6); // Determine which array to use (0-4)
        if (arrayIndex < jobArrays.length) {
          jobArrays[arrayIndex].push(testList[i]);
        }
      }

      console.log(jobArrays);

      /* let jobs1 = [];
let jobs2 = [];
let jobs3 = [];
let jobs4 = [];
let jobs5 = [];
let jobArrays = [jobs1, jobs2, jobs3, jobs4, jobs5];

for (let i = 0; i < jobSiteList.length; i++) {
  const arrayIndex = Math.floor(i / 6); // Determine which array to use (0-4)
  if (arrayIndex < jobArrays.length) {
    jobArrays[arrayIndex].push(jobSiteList[i]);
  }
} */
      //setJobs(res.jobSiteList || []);
      console.log(testList.length);
      setJobArray(jobArrays || []);
    } catch (error) {
      console.error("Error fetching company list: ", error);
    }
  };
  return (
    <div className="p-1">
      <div className="flex justify-between">
        <div className="text-left px-2 font-bold text-lg">플래티넘 광고</div>
        <div className="text-right px-2">
          {counter} / {jobArray.length}
        </div>
      </div>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        onSlideChange={e => setCounter(e.activeIndex + 1)}
        onSwiper={swiper => console.log(swiper)}
      >
        {jobArray.map((jobs, idx) => (
          <SwiperSlide key={idx}>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 w-full lg:px-0 p-1 rounded drop-shadow">
              {jobs.slice(0, 6).map((job, idx) => (
                <Link
                  key={idx}
                  to={`/job/detail?aid=${job.aid}`}
                  className="px-4 py-2 bg-white dark:bg-white border rounded-lg w-full flex flex-col gap-y-2 justify-center h-[200px] hover:bg-rose-50 jobList shadow hover:shadow-lg"
                >
                  <div className="max-w-[150px] h-[60px] lg:max-w-[200px] lg:h-[80px] mx-auto overflow-hidden relative dark:bg-white">
                    <ImgLoader
                      image={`${baseUrl}${job.logoImg}`}
                      altText={job.title}
                      tag={"max-w-full h-auto my-auto"}
                    />
                  </div>
                  <div className="text-base font-bold">{job.title}</div>
                  <div className="text-sm text-nowrap text-ellipsis">
                    {job.company}
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
              {jobs.length < 6 && (
                <Link
                  key={idx}
                  to={`/`}
                  className="px-4 py-2 bg-white dark:bg-white border rounded-lg w-full flex flex-col justify-center h-[200px] hover:bg-rose-50 jobList shadow hover:shadow-lg"
                  onClick={e => {
                    e.preventDefault();
                    alert("준비중 입니다");
                  }}
                >
                  <div className="text-5xl font-thin text-center text-gray-500">
                    +
                  </div>
                  <div className="text-base font-bold text-center text-gray-500">
                    광고 모집중
                  </div>
                </Link>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default PlatinumJobs;
