import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { api } from "../../Api/Api";
import { grades } from "../../Data/Data";
import queryString from "query-string";
import Pagenation from "../../Components/Pagenation";
import dayjs from "dayjs";
import Modal from "../../Components/Modal";
import sorry from "../../assets/sorry.png";

function AdList() {
  const navi = useNavigate();
  const [totalCount, setTotalCount] = useState(0);
  const [startedCount, setStartedCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [endedCount, setEndedCount] = useState(0);
  const [adList, setAdList] = useState([]);
  const [last, setLast] = useState(1);

  const [modalOn, setModalOn] = useState(false); //모달창 오픈 설정
  const [modalType, setModalType] = useState(""); //모달창 종류 설정
  const [selectedAd, setSelectedAd] = useState(null);
  //const [selected, setSelected] = useState([])
  const thisLocation = useLocation();
  const parsed = queryString.parse(thisLocation.search);
  const status = parsed.status || "";
  const page = parsed.page || 1;
  const size = parsed.size || 20;
  useEffect(() => {
    getAdList();
    //eslint-disable-next-line
  }, [thisLocation]);

  useEffect(() => {
    if (!modalOn) {
      setSelectedAd(null);
    }
  }, [modalOn]);

  const getGrade = async grade => {
    const item = grades.find(el => el.value === grade);
    return item ? item.txt : "미사용";
  };

  const getAdList = async () => {
    let data = {
      page: page,
      size: size,
    };
    let url;
    if (!status || status === "all") {
      url = "/api/v1/formMail_ad/allAdList";
    } else {
      url = "/api/v1/formMail_ad/statusList";
      if (status === "started") {
        data.status = "진행중";
      } else if (status === "ended") {
        data.status = "종료";
      } else if (status === "waiting") {
        data.status = "대기중";
      } else {
        alert("잘못된 접근 경로입니다");
        navi("/admin/adlist");
      }
    }
    const res = await api.post(url, { json: data }).json();
    const count = await api.get("/api/v1/formMail_ad/count/ads").json();
    console.log(res);

    const list = [];
    let counter;
    if (!status || status === "all") {
      counter = Number(count.totalAds);
    } else {
      if (status === "started") {
        counter = Number(count.activeAds);
      } else if (status === "ended") {
        counter = Number(count.closeAds);
      } else if (status === "waiting") {
        counter = Number(count.waitAds);
      } else {
        counter = 0;
      }
    }
    res.fmAdList.forEach((ad, idx) => {
      const index = ad.index ?? idx; // ad.index가 없으면 배열 인덱스를 사용
      ad.number = (counter || 0) - (index + (Number(page) - 1) * Number(size));

      list.push(ad);
    });
    const list2 = [];
    for (const ad of list) {
      ad.gradeTxt = await getGrade(ad.grade);
      list2.push(ad);
    }

    setTotalCount(count.totalAds);
    setStartedCount(count.activeAds);
    setWaitingCount(count.waitAds);
    setEndedCount(count.closeAds);
    setLast(res.totalPages);
    setAdList(list2);
  };

  const getStatus = (start, end) => {
    const today = dayjs().startOf("day"); // 오늘의 시작 (시간 00:00:00)
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    if (startDate.isAfter(today)) {
      return "대기";
    }
    if (endDate.isBefore(today)) {
      return "종료";
    }
    return "진행";
  };

  const endIt = async aid => {
    const confirm = window.confirm(
      "마감 후에는 삭제와 재등록만 가능합니다\n진행할까요?"
    );
    if (!confirm) {
      return false;
    }
    const data = {
      aid: aid,
    };

    const res = await api
      .put("/api/v1/formMail_ad/update/close", { json: data })
      .json();
    console.log(res);
    if (res.code === "C000") {
      alert("마감되었습니다");
      getAdList();
    }
  };
  return (
    <>
      <div className="w-full max-w-[1240px] mx-auto mt-[100px] bg-white py-10 grid grid-cols-1 gap-y-[40px] mb-20 px-5">
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
              {totalCount ? Number(startedCount).toLocaleString() : ""}
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
              {totalCount ? Number(waitingCount).toLocaleString() : ""}
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
              {totalCount ? Number(endedCount).toLocaleString() : ""}
            </span>
          </Link>
        </div>
        {totalCount > 0 && (
          <div className="grid grid-cols-1 gap-y-2">
            <div>
              {!status || status === "all"
                ? "전체"
                : status === "started"
                ? "진행중"
                : status === "waiting"
                ? "대기중"
                : status === "ended"
                ? "종료"
                : ""}{" "}
              공고 |{" "}
              <span className="text-primary font-bold">
                {!status || status === "all"
                  ? totalCount
                  : status === "started"
                  ? startedCount
                  : status === "waiting"
                  ? waitingCount
                  : status === "ended"
                  ? endedCount
                  : ""}
              </span>{" "}
              건
            </div>
          </div>
        )}

        {adList && adList.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-0">
            <div className="flex justify-center py-2 border-y text-[14px]">
              <div className="w-[60px] text-center">번호</div>
              <div className="w-[180px] text-center">등록일</div>
              <div className="w-[360px] text-center">제목</div>
              <div className="w-[80px] text-center">등록관리</div>
              <div className="w-[160px] text-center">모집현황</div>
              <div className="w-[160px] text-center">지원현황</div>
              <div className="w-[180px] text-center">유료상품적용</div>
            </div>
            <>
              {adList.map((ad, idx) => (
                <div
                  className="flex justify-center py-2 border-y text-[14px]"
                  key={idx}
                >
                  <div className="w-[60px] text-center" data={ad.aid}>
                    <div className="flex flex-col justify-center h-full">
                      {ad.number}
                    </div>
                  </div>
                  <div className="w-[180px] text-center">
                    <div className="flex flex-col justify-center gap-y-2 h-full">
                      {ad.num ? (
                        <div className="text-[14px] font-bold">{ad.num}</div>
                      ) : null}
                      <div className="text-[12px] text-gray-500">
                        {ad.created} 등록
                      </div>
                      <div className="text-[12px] text-blue-500">
                        {ad.updated} 수정
                      </div>
                    </div>
                  </div>
                  <div className="w-[360px] text-left">
                    <div className="flex flex-col justify-center gap-y-2 h-full w-full">
                      <div className="text-[12px] text-gray-500">
                        {ad.company} 등록
                      </div>
                      <div className="text-[16px] text-black whitespace-nowrap text-ellipsis w-full overflow-x-hidden">
                        <a
                          href={`https://goalba.co.kr/joblist/${ad.aid}`}
                          className="font-extra"
                          target="_blank"
                        >
                          {ad.title}
                        </a>
                      </div>
                      <div className="text-[12px] text-gray-500">
                        {ad.sido} {ad.sigungu} {ad.dongEubMyun} | 담당자{" "}
                        {ad.managerName}
                      </div>
                      <div className="flex justify-start gap-x-2">
                        <div
                          className={`rounded-lg py-1 px-2 text-[12px] ${
                            getStatus(ad.startDate, ad.endDate) === "진행"
                              ? "bg-[#DDEEFF]"
                              : getStatus(ad.startDate, ad.endDate) === "대기"
                              ? "bg-[#DCFFDC]"
                              : getStatus(ad.startDate, ad.endDate) === "종료"
                              ? "bg-[#FFDCDC]"
                              : ""
                          }`}
                        >
                          {getStatus(ad.startDate, ad.endDate)}
                        </div>
                        {ad.startDate && ad.endDate ? (
                          <div className="text-[12px] text-gray-500 py-1">
                            {ad.startDate} ~ {ad.endDate}
                          </div>
                        ) : (
                          <div className="text-[12px] text-gray-500 py-1">
                            상시모집
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="w-[80px] text-center">
                    <div className="flex flex-col justify-center gap-y-2 h-full">
                      {getStatus(ad.startDate, ad.endDate) !== "종료" ? (
                        <>
                          <Link
                            to={`/admin/adinput?aid=${ad.aid}`}
                            className="py-1 px-4 border bg-white hover:bg-gray-50 text-[12px] w-[60px] mx-auto"
                          >
                            수정
                          </Link>
                          <button
                            className="py-1 px-4 border bg-white hover:bg-gray-50 text-[12px] w-[60px] mx-auto"
                            onClick={() => endIt(ad.aid)}
                          >
                            마감
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="font-bold text-success">마감</div>
                          <button className="py-1 px-4 border bg-white hover:bg-gray-50 text-[12px] w-[60px] mx-auto">
                            삭제
                          </button>
                        </>
                      )}

                      <Link
                        to={`/admin/adinput?aid=${ad.aid}&reinput=y`}
                        className="py-1 px-1 border bg-white hover:bg-gray-50 text-[12px] w-[60px] mx-auto"
                      >
                        재등록
                      </Link>
                    </div>
                  </div>
                  <div className="w-[160px] text-center">
                    <div className="flex  flex-col justify-center gap-y-2 h-full text-sm">
                      <div className="flex flex-row justify-between w-[85%] mx-auto">
                        <div className="text-left">조회수</div>
                        <div className="text-right">
                          {Math.round(Math.random() * 100) + 20} 회
                        </div>
                      </div>
                      <div className="flex flex-row justify-between w-[85%] mx-auto">
                        <div className="text-left">전체지원자</div>
                        <div className="text-right">
                          {Math.round(Math.random() * 15)} 명
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[160px] text-center">
                    <div className="flex flex-col justify-center gap-y-2 h-full text-sm">
                      <div className="flex flex-row justify-between w-[85%] mx-auto">
                        <div className="text-left">열람</div>
                        <div className="text-right">
                          {Math.round(Math.random() * 10) + 10} 회
                        </div>
                      </div>
                      <div className="flex flex-row justify-between w-[85%] mx-auto text-success font-extra">
                        <div className="text-left">미열람</div>
                        <div className="text-right">
                          {Math.round(Math.random() * 5)} 명
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[180px] text-center">
                    <div
                      className={`flex flex-col justify-center h-full ${
                        ad.focus ? "gap-y-1" : "gap-y-4 "
                      }`}
                    >
                      <div className="font-bold">{ad.gradeTxt}</div>
                      {ad.focus && (
                        <div className="font-bold text-sm text-blue-500">
                          포커스 공고 사용중
                        </div>
                      )}
                      <button
                        className="py-1 px-4 border bg-white hover:bg-gray-50 w-full"
                        onClick={() => {
                          setModalOn(true);
                          setModalType("grade");
                          setSelectedAd(ad);
                        }}
                      >
                        유료상품변경
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          </div>
        ) : (
          <div className="text-2xl text-bold text-center">
            <img
              src={sorry}
              className="mx-auto w-[240px] h-auto mb-5 mt-20"
              alt="오류"
            />
            조회 된 내용이 없습니다
          </div>
        )}
        {adList && adList.length > 0 ? <Pagenation last={last} /> : null}
      </div>

      <Modal
        modalOn={modalOn}
        setModalOn={setModalOn}
        modalType={modalType}
        setModalType={setModalType}
        selectedAd={selectedAd}
        getAdList={getAdList}
      />
    </>
  );
}

export default AdList;
