import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { api, useLogout } from "../../Api/Api";
import { adStats, grades, searchTypes } from "../../Data/Data";
import queryString from "query-string";
import Pagenation from "../../Components/Pagenation";
import dayjs from "dayjs";
import Modal from "../../Components/Modal";
import sorry from "../../assets/sorry.png";

function AdList() {
  const navi = useNavigate();
  const logout = useLogout();
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [startedCount, setStartedCount] = useState(0);
  const [waitingCount, setWaitingCount] = useState(0);
  const [endedCount, setEndedCount] = useState(0);
  const [searchCount, setSearchCount] = useState(0);
  const [adList, setAdList] = useState([]);
  const [last, setLast] = useState(1);
  const [sType, setSType] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [checkedAd, setCheckedAd] = useState([]);
  const [errMsg, setErrMsg] = useState("조회 된 내용이 없습니다");

  const [modalOn, setModalOn] = useState(false); //모달창 오픈 설정
  const [modalType, setModalType] = useState(""); //모달창 종류 설정
  const [selectedAd, setSelectedAd] = useState(null);
  //const [selected, setSelected] = useState([])
  const thisLocation = useLocation();
  const parsed = queryString.parse(thisLocation.search);
  const status = parsed.status || "all";
  const page = parsed.page || 1;
  const size = parsed.size || 20;
  const keyword = parsed.keyword || "";
  const searchtype = parsed.searchtype || "";
  useEffect(() => {
    setSType("title");
    setSearchKeyword("");
    if (searchtype === "unique") {
      getNumAd();
    } else {
      getAdList();
    }
    //eslint-disable-next-line
  }, [thisLocation]);

  useEffect(() => {
    if (!modalOn) {
      setSelectedAd(null);
    }
  }, [modalOn]);

  const getNumAd = async () => {
    setLoading(true);
    setAdList([]);
    if (isNaN(keyword)) {
      navi("/admin/ad/list");
      return alert("잘못된 경로로 들어오셨습니다");
    }

    setSType(searchtype);
    setSearchKeyword(keyword);
    const data = {
      num: Number(keyword),
    };
    const res = await api
      .post("/api/v1/formMail_ad/search/one/num", { json: data })
      .json();
    if (res.code === "E403") {
      logout();
    }
    setAdList(res.fmAdList);
    setLoading(false);
  };

  const getGrade = async grade => {
    const item = grades.find(el => el.value === grade);
    return item ? item.txt : "미사용";
  };

  const getAdList = async () => {
    setLoading(true);
    setAdList([]);
    let data = {
      page: page,
      size: size,
    };
    let url;
    if (!status || status === "all") {
      url = "/api/v1/formMail_ad/allAdList";
    } else {
      url = "/api/v1/formMail_ad/statusList";
      const stat = await getStat(status);
      if (stat === "에러") {
        alert("잘못된 접근 경로입니다");
        navi("/admin/ad/list");
        return false;
      } else {
        data.status = stat;
      }
    }
    if (searchtype && keyword) {
      url = "/api/v1/formMail_ad/statusList";
      setSType(searchtype);
      setSearchKeyword(keyword);
      const type = await getType(searchtype);
      if (type === "에러") {
        setErrMsg("잘못된 경로로 접속하셨습니다");
        setAdList(null);
        navi("/admin/ad/list");
        return false;
      } else {
        data.searchType = type;
        data.keyword = keyword;
      }
    }
    const res = await api.post(url, { json: data }).json();
    const count = await api.get("/api/v1/formMail_ad/count/ads").json();

    if (res.code === "E403") {
      logout();
    }
    const list = [];
    if (res.fmAdList && res.fmAdList.length > 0) {
      for (const ad of res.fmAdList) {
        ad.gradeTxt = await getGrade(ad.grade);
        list.push(ad);
      }
    }

    setTotalCount(count.totalAds);
    setStartedCount(count.activeAds);
    setWaitingCount(count.waitAds);
    setEndedCount(count.closeAds);
    setLast(res.totalPages);
    setAdList(list);
    if (searchtype && keyword) setSearchCount(res.totalCount);
    setLoading(false);
  };

  const checkAllAds = async e => {
    if (e.target.checked) {
      const checkedList = [];
      for (const ad of adList) {
        let data = {};
        data.aid = ad.aid;
        data.stat = await getStatus(ad.startDate, ad.endDate);
        checkedList.push(data);
      }
      setCheckedAd(checkedList);
    } else {
      setCheckedAd([]);
    }
  };

  const getType = value => {
    const result = searchTypes.find(item => item.value === value);
    return result ? result.type : "에러";
  };

  const getStat = value => {
    const result = adStats.find(item => item.value === value);
    return result ? result.txt : "전체";
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

  const endIt = async (aid, multiple) => {
    if (!multiple) {
      const confirm = window.confirm(
        "마감 후에는 삭제와 재등록만 가능합니다\n진행할까요?"
      );
      if (!confirm) {
        return false;
      }
    }
    const data = {
      aid: aid,
    };

    const res = await api
      .put("/api/v1/formMail_ad/update/close", { json: data })
      .json();
    if (res.code === "C000") {
      if (!multiple) alert("마감되었습니다");
      getAdList();
    }
    if (multiple) return res;
  };

  const checkedAction = async type => {
    let count = 0;
    const err = [];
    let txt;
    if (type === "end") {
      txt = "마감 후에는 삭제와 재등록만 가능합니다\n진행할까요?";
    } else {
      txt = "삭제하면 복구할 수 없습니다!\n진행할까요?";
    }
    const confirm = window.confirm(txt);
    if (!confirm) return false;
    for (const ad of checkedAd) {
      if (type === "end") {
        if (ad.stat === "종료") {
          continue;
        }
        const res = await endIt(ad.aid, true);
        if (res.code === "C000") {
          count = count + 1;
        } else {
          err.push(ad.aid);
        }
      } else if (type === "delete") {
        if (ad.stat !== "종료") {
          continue;
        }
        const res = await deleteAd(ad.aid, true);
        if (res.code === "C000") {
          count = count + 1;
        } else {
          err.push(ad.aid);
        }
      } else {
        return alert("올바르지 않은 접근입니다");
      }
    }
    alert("완료");
    getAdList();
  };

  const deleteAd = async (aid, multiple) => {
    if (!multiple) {
      const confirm = window.confirm(
        "삭제하면 복구할 수 없습니다!\n진행할까요?"
      );
      if (!confirm) return false;
    }
    const data = {
      aid: aid,
    };
    const res = await api
      .delete("/api/v1/formMail_ad/deleteAd", { json: data })
      .json();
    if (res.code === "C000") {
      if (!multiple) alert("공고가 삭제되었습니다");
      getAdList();
    }
    if (multiple) return res;
  };

  const searchIt = value => {
    let sKeyword;
    if (value) {
      sKeyword = value;
    } else {
      sKeyword = searchKeyword;
    }
    if (sKeyword === "") {
      if (keyword) {
        navi("/admin/ad/list");
      } else {
        return false;
      }
    } else {
      navi(`/admin/ad/list?searchtype=${sType}&keyword=${sKeyword}`);
    }
  };

  const searchCancel = () => {
    navi("/admin/ad/list");
  };

  const checkAd = async (e, ad) => {
    const checked = e.target.checked;
    let data = {};
    data.aid = ad.aid;
    data.stat = await getStatus(ad.startDate, ad.endDate);
    if (checked) {
      setCheckedAd(prev => [...prev, data]);
    } else {
      setCheckedAd(prev => prev.filter(item => item.aid !== data.aid));
    }
  };
  return (
    <>
      <div className="w-full bg-white py-10 grid grid-cols-1 gap-y-[40px] mb-20 px-5">
        <h2 className="lg:text-2xl font-extra text-[#069]">공고 목록</h2>

        <div className="flex justify-between border-b">
          <div className="flex justify-start gap-x-0">
            <Link
              to={`/admin/ad/list${
                searchtype && keyword
                  ? `?searchtype=${searchtype}&keyword=${keyword}`
                  : ""
              }`}
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
              to={`/admin/ad/list?status=started${
                searchtype && keyword
                  ? `&searchtype=${searchtype}&keyword=${keyword}`
                  : ""
              }`}
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
              to={`/admin/ad/list?status=waiting${
                searchtype && keyword
                  ? `&searchtype=${searchtype}&keyword=${keyword}`
                  : ""
              }`}
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
              to={`/admin/ad/list?status=ended${
                searchtype && keyword
                  ? `&searchtype=${searchtype}&keyword=${keyword}`
                  : ""
              }`}
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
          {totalCount > 0 ? (
            <div className="grid grid-cols-1 gap-y-2">
              <div className="py-5">
                {getStat(status)} 공고 |{" "}
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
                건{" "}
                {searchtype && keyword && (
                  <span>
                    중{" "}
                    <span className="text-success font-bold">
                      {searchCount}
                    </span>
                    건 검색됨
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>

        <div
          className={`flex ${
            adList && adList.length > 0 ? "justify-between" : "justify-end"
          }`}
        >
          {adList && adList.length > 0 ? (
            <div className="flex flex-row justify-start gap-x-4">
              <div className="py-2">{checkedAd.length}개 선택됨</div>
              {status !== "ended" && (
                <button
                  className="p-2 border hover:bg-gray-100"
                  onClick={() => checkedAction("end")}
                >
                  {checkedAd.length === adList.length ? "전체" : "선택"} 마감
                </button>
              )}
              {status === "ended" ||
                (status === "all" && (
                  <button
                    className="p-2 border hover:bg-gray-100"
                    onClick={() => checkedAction("delete")}
                  >
                    {checkedAd.length === adList.length ? "전체" : "선택"} 삭제
                  </button>
                ))}
            </div>
          ) : null}
          <div className="flex justify-end gap-x-2 text-[14px] whitespace-nowrap break-keep">
            <select
              id="searchType"
              name="searchType"
              className="border border-gray-300 text-[#666] text-sm rounded focus:ring-orange-500 focus:border-orange-500 block w-fit p-1 py-2"
              value={sType || ""}
              onChange={e => {
                setSType(e.currentTarget.value);
              }}
            >
              {searchTypes.map((type, idx) => (
                <option key={idx} value={type.value}>
                  {type.txt}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="w-full p-2 border border-[#ccc] rounded-sm"
              value={searchKeyword || ""}
              onChange={e => setSearchKeyword(e.currentTarget.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                  searchIt(e.currentTarget.value);
                }
              }}
            />
            <button
              className="bg-primary hover:bg-opacity-80 text-white p-2 rounded"
              onClick={() => {
                searchIt();
              }}
            >
              검색하기
            </button>
            {keyword && (
              <button
                className="bg-green-600 hover:bg-opacity-80 text-white p-2 rounded"
                onClick={() => {
                  searchCancel();
                }}
              >
                초기화
              </button>
            )}
          </div>
        </div>
        {adList && adList.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-0">
            <div className="flex justify-around py-2 border-y text-[14px]">
              <div className="w-[60px] text-center">
                <input
                  id="checkAll"
                  type="checkbox"
                  name="checkAll"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                  checked={checkedAd.length === adList.length}
                  onChange={checkAllAds}
                />
              </div>
              <div className="w-[180px] text-center">번호/등록일</div>
              <div className="w-[360px] text-center">제목</div>
              <div className="w-[80px] text-center">등록관리</div>
              <div className="w-[160px] text-center">모집현황</div>
              <div className="w-[160px] text-center">지원현황</div>
              <div className="w-[180px] text-center">유료상품적용</div>
            </div>
            <>
              {adList.map((ad, idx) => (
                <div
                  className="flex justify-around py-2 border-y text-[14px]"
                  key={idx}
                  data={ad.aid}
                >
                  <div className="w-[60px] text-center flex justify-center">
                    <div className="flex flex-col justify-center h-full">
                      <input
                        id={`checkAll-${ad.aid}`}
                        type="checkbox"
                        name={`checkAll-${ad.aid}`}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                        checked={checkedAd.some(item => item.aid === ad.aid)}
                        onChange={e => checkAd(e, ad)}
                      />
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
                          onClick={e => {
                            if (
                              getStatus(ad.startDate, ad.endDate) === "종료"
                            ) {
                              e.preventDefault();
                              alert("마감된 공고는 재등록 후 확인 가능합니다");
                            } else if (
                              getStatus(ad.startDate, ad.endDate) === "대기"
                            ) {
                              e.preventDefault();
                              alert(
                                "대기중 공고는 수정/재등록 페이지에서 확인 가능합니다"
                              );
                            }
                          }}
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
                            to={`/admin/ad/input?aid=${ad.aid}`}
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
                          <button
                            className="py-1 px-4 border bg-white hover:bg-gray-50 text-[12px] w-[60px] mx-auto"
                            onClick={() => deleteAd(ad.aid)}
                          >
                            삭제
                          </button>
                        </>
                      )}

                      <Link
                        to={`/admin/ad/input?aid=${ad.aid}&reinput=y`}
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
                        <div className="text-right">{ad.viewCount || 0} 회</div>
                      </div>
                      <div className="hidden flex-row justify-between w-[85%] mx-auto">
                        <div className="text-left">전체지원자</div>
                        <div className="text-right">00 명</div>
                      </div>
                    </div>
                  </div>
                  <div className="w-[160px] text-center ">
                    <div className="flex flex-col justify-center gap-y-2 h-full text-sm">
                      <div className="flex flex-row justify-between w-[85%] mx-auto">
                        <div className="text-left">열람</div>
                        <div className="text-right">000 명</div>
                      </div>
                      <div className="flex flex-row justify-between w-[85%] mx-auto text-success font-extra">
                        <div className="text-left">미열람</div>
                        <div className="text-right">0 명</div>
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
          <>
            {!loading && (
              <div className="text-2xl text-bold text-center">
                <img
                  src={sorry}
                  className="mx-auto w-[240px] h-auto mb-5 mt-20"
                  alt="오류"
                />
                {errMsg}
              </div>
            )}
          </>
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

      {loading && (
        <div className="bg-white bg-opacity-55 w-[100vw] h-[100vh] fixed top-0 left-0 overflow-hidden z-[9999999999]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit min-w-[50px] text-center flex flex-col justify-center z-[10000000000]">
            <div className="loader" />
            <span className="absolute w-[50vw] bottom-0 left-1/2 -translate-x-1/2 translate-y-8">
              불러오는 중...
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default AdList;
