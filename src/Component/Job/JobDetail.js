import { api } from "../Api/Api";
import queryString from "query-string";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ImgLoader from "../Image/ImgLoader";
import { baseUrl } from "../Api/Api";

function JobDetail() {
  const navi = useNavigate();
  const thisLocation = useLocation();
  const parsed = queryString.parse(thisLocation.search);
  const aid = parsed.aid || "error";
  const [count, setCount] = useState(0);
  const [jobInfo, setJobInfo] = useState(null);
  const [workDayList, setWorkDayList] = useState([]);
  const [welfare, setWelfare] = useState([]);
  const [height, setHeight] = useState("100px");
  useEffect(() => {
    if (aid === "error") {
      alert("잘못된 접근 경로입니다");
      navi(-1);
    } else {
      getJob(aid);
    }
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    // 10초마다 실행되는 타이머
    const interval = setInterval(() => {
      setCount(prevCount => {
        let newCount;
        const maxCount = welfare.length > 0 ? welfare.length - 1 : 2; // 배열 길이가 0보다 크면 welfare.length - 1, 그렇지 않으면 2

        do {
          // 0과 maxCount 사이의 무작위 숫자 생성
          newCount = Math.floor(Math.random() * (maxCount + 1));
        } while (newCount === prevCount); // 이전 값과 같은지 확인
        return newCount;
      });
    }, 2000); // 3초

    // 컴포넌트가 언마운트 될 때 타이머 정리
    return () => clearInterval(interval);
  }, [welfare.length]); // 배열 길이가 바뀌면 useEffect 재실행

  const getJob = async aid => {
    const data = {
      aid: aid,
    };
    try {
      const res = await api
        .post("/api/v1/formMail_ad/findOneJobsite", { json: data })
        .json();
      //console.log(res);
      setJobInfo(res.jobSiteList[0] || null);
      setWorkDayList(res.jobSiteList[0].workDay.split(", "));
      setWelfare(res.jobSiteList[0].welfare.split(", "));
    } catch (error) {
      console.error("Error fetching company list: ", error);
    }
  };

  return (
    <>
      {jobInfo ? (
        <>
          <h3 className="text-center font-neoextra text-2xl lg:text-4xl mb-3 w-full">
            {jobInfo.title}
          </h3>
          <div className="w-[98vw] lg:max-w-[1400px] mx-auto h-fit grid grid-cols-1 lg:grid-cols-2 gap-x-2">
            <div className="h-fit">
              <div className="w-fit max-w-[800px] mx-auto">
                <Link to={`/apply?aid=${aid}`}>
                  <ImgLoader
                    image={`${baseUrl}${jobInfo.adImg}`}
                    altText={jobInfo.title}
                    setHeight={setHeight}
                    isAd={true}
                    tag={"max-w-full h-auto my-auto"}
                  />
                </Link>
              </div>
            </div>
            <div
              className={`hidden lg:block relative w-fit min-w-[100px] min-h-[${height}] max-w-[300px]`}
            >
              <div className="sticky top-10 left-0 w-full h-fit min-h-[100px]">
                <div className="bg-white border p-4 flex flex-col justify-start gap-y-2 max-w-[300px]">
                  <div className="max-w-[250px] max-h-[100px] overflow-hidden dark:bg-white">
                    <ImgLoader
                      image={`${baseUrl}${jobInfo.logoImg}`}
                      altText={jobInfo.title}
                      tag={"max-w-full h-auto my-auto"}
                    />
                  </div>
                  <div className="flex justify-start gap-x-1">
                    <span className="font-normal">기업명</span>
                    <span>{" : "}</span>
                    <span className="font-bold">{jobInfo.company}</span>
                  </div>
                  <div className="flex justify-start gap-x-1">
                    <span className="font-normal">채용기간</span>
                    <span>{" : "}</span>
                    <span className="font-bold">{jobInfo.endDate}</span>
                    <span>까지</span>
                  </div>
                  <div className="flex justify-start gap-x-1">
                    <span className="font-normal">근무요일</span>
                    <span>{" : "}</span>
                    <span>주</span>
                    <span className="font-bold">{workDayList.length}</span>
                    <span>일 근무</span>
                  </div>
                  <div className="flex justify-start gap-x-1">
                    <span className="font-normal text-transparent">
                      요일상세
                    </span>
                    <span className="text-transparent">{" : "}</span>
                    {workDayList.includes("0") && (
                      <span className="font-bold text-rose-500">일</span>
                    )}
                    {workDayList.includes("1") && (
                      <span className="font-bold">월</span>
                    )}
                    {workDayList.includes("2") && (
                      <span className="font-bold">화</span>
                    )}
                    {workDayList.includes("3") && (
                      <span className="font-bold">수</span>
                    )}
                    {workDayList.includes("4") && (
                      <span className="font-bold">목</span>
                    )}
                    {workDayList.includes("5") && (
                      <span className="font-bold">금</span>
                    )}
                    {workDayList.includes("6") && (
                      <span className="font-bold text-blue-500">토</span>
                    )}
                  </div>
                  <div className="flex justify-start gap-x-1">
                    <span className="font-normal">근무시간</span>
                    <span>{" : "}</span>
                    <span className="font-bold">{jobInfo.workStart}</span>
                    <span>~</span>
                    <span className="font-bold">{jobInfo.workEnd}</span>
                  </div>
                  {welfare.length > 0 && (
                    <div className="flex justify-start gap-x-1 gap-y-1 flex-wrap">
                      <span className="font-normal py-1">복지혜택</span>
                      <span className="py-1">{" : "}</span>
                      {welfare.map((wel, idx) => (
                        <span
                          key={idx}
                          className={`p-1 border text-xs rounded ${
                            count === idx &&
                            "bg-indigo-50 text-indigo-500 border-indigo-500 font-bold"
                          }`}
                        >
                          {wel}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    to={`/apply?aid=${aid}`}
                    className="block text-center bg-green-500 hover:bg-green-700 text-white font-bold p-2"
                  >
                    지원하기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-[800px] relative">
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
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
        </div>
      )}
    </>
  );
}

export default JobDetail;
