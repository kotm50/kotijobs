import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { api } from "../../Api/Api";
import queryString from "query-string";

function AdList() {
  const [totalCount, setTotalCount] = useState(0);
  const thisLocation = useLocation();
  const parsed = queryString.parse(thisLocation.search);
  const status = parsed.status || "";
  const page = parsed.page || 1;
  const size = parsed.size || 20;
  useEffect(() => {
    getAdList();
    //eslint-disable-next-line
  }, [thisLocation]);

  const getAdList = async () => {
    const data = {
      page: page,
      size: size,
    };
    const res = await api
      .post("/api/v1/formMail_ad/allJobsiteList", { json: data })
      .json();
    console.log(res);
    setTotalCount(res.totalCount);
  };
  return (
    <>
      <div className="w-full max-w-[1240px] mx-auto mt-[100px] bg-white py-10 grid grid-cols-1 gap-y-[100px] mb-20 px-5">
        <h2 className="lg:text-2xl font-extra text-[#069]">공고 관리</h2>
        <div className="border-b flex justify-start gap-x-0">
          <Link
            to={`/admin/adlist`}
            className={`${
              !status || status === "all"
                ? "bg-primary text-white hover:bg-opacity-50"
                : "bg-white text-black hover:bg-gray-50"
            } py-5 px-4 border border-b-0 rounded-t-lg`}
          >
            전체공고{" "}
            <span
              className={`${
                !status || status === "all" ? "text-warning" : "text-primary"
              } font-extra`}
            >
              {totalCount ? Number(totalCount).toLocaleString() : ""}
            </span>
          </Link>
          <Link
            to={`/admin/adlist?status=started`}
            className={`${
              status === "started"
                ? "bg-primary text-white hover:bg-opacity-50"
                : "bg-white text-black hover:bg-gray-50"
            } py-5 px-4 border border-b-0 rounded-t-lg`}
          >
            진행중{" "}
            <span
              className={`${
                status === "started" ? "text-warning" : "text-primary"
              } font-extra`}
            >
              0000
            </span>
          </Link>
          <Link
            to={`/admin/adlist?status=waiting`}
            className={`${
              status === "waiting"
                ? "bg-primary text-white hover:bg-opacity-50"
                : "bg-white text-black hover:bg-gray-50"
            } py-5 px-4 border border-b-0 rounded-t-lg`}
          >
            대기중{" "}
            <span
              className={`${
                status === "waiting" ? "text-warning" : "text-primary"
              } font-extra`}
            >
              0000
            </span>
          </Link>
          <Link
            to={`/admin/adlist?status=ended`}
            className={`${
              status === "ended"
                ? "bg-primary text-white hover:bg-opacity-50"
                : "bg-white text-black hover:bg-gray-50"
            } py-5 px-4 border border-b-0 rounded-t-lg`}
          >
            종료{" "}
            <span
              className={`${
                status === "ended" ? "text-warning" : "text-primary"
              } font-extra`}
            >
              0000
            </span>
          </Link>
        </div>
      </div>
    </>
  );
}

export default AdList;
