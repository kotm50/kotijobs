import { useEffect, useState } from "react";
import { sidoList } from "../../Data/Data";
import { api } from "../../Api/Api";

function SearchArea(props) {
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");
  const [dongmyun, setDongmyun] = useState("");
  const [sigunguList, setSigunguList] = useState([]);
  const [dongmyunList, setDongmyunList] = useState([]);

  useEffect(() => {
    if (props.modalType === "areaA") {
      setSido(props.areaA.sido || "");
      setSigungu(props.areaA.sigungu || "");
      setDongmyun(props.areaA.dongmyun || "");
    } else if (props.modalType === "areaB") {
      setSido(props.areaB.sido || "");
      setSigungu(props.areaB.sigungu || "");
      setDongmyun(props.areaB.dongmyun || "");
    } else if (props.modalType === "areaC") {
      setSido(props.areaC.sido || "");
      setSigungu(props.areaC.sigungu || "");
      setDongmyun(props.areaC.dongmyun || "");
    }
    //eslint-disable-next-line
  }, [props.modalType]);

  useEffect(() => {
    if (sido) getSigungu(sido);
  }, [sido]);

  useEffect(() => {
    if (sigungu) getDongmyun(sido, sigungu);
    //eslint-disable-next-line
  }, [sigungu]);

  const getSigungu = async value => {
    const data = {
      sido: value,
    };
    const res = await api
      .post("/api/v1/formMail_ad/sigunguList", { json: data })
      .json();
    let sigungu = [...new Set(res.regionsList.map(region => region.sigungu))];

    // "전체"를 맨 앞으로 이동
    if (sigungu.includes("전체")) {
      sigungu = ["전체", ...sigungu.filter(item => item !== "전체")];
    }
    console.log(res.regionsList.length, sigungu.length);
    setSigunguList(sigungu);
  };

  const getDongmyun = async (value1, value2) => {
    const data = {
      sido: value1,
      sigungu: value2,
    };
    const res = await api
      .post("/api/v1/formMail_ad/dongEubMyunList", { json: data })
      .json();
    let dongmyun = [
      ...new Set(res.regionsList.map(region => region.dongEubMyun)),
    ];

    // "전체"를 맨 앞으로 이동
    if (dongmyun.includes("전체")) {
      dongmyun = ["전체", ...dongmyun.filter(item => item !== "전체")];
    }
    console.log(res.regionsList.length, dongmyun.length);
    setDongmyunList(dongmyun);
  };

  const submit = () => {
    if (!sido) {
      return alert("지역을 선택하세요");
    } else if (sido !== "전국" && !sigungu) {
      return alert("시/군/구를 선택하세요");
    } else if (sido !== "전국" && sigungu !== "전체" && !dongmyun) {
      return alert("동/읍/면을 선택하세요");
    }
    if (props.modalType === "areaA") {
      props.setAreaA({
        sido: sido,
        sigungu: sigungu,
        dongEubMyun: dongmyun,
      });
    } else if (props.modalType === "areaB") {
      props.setAreaB({
        sido: sido,
        sigungu: sigungu,
        dongEubMyun: dongmyun,
      });
    } else if (props.modalType === "areaC") {
      props.setAreaC({
        sido: sido,
        sigungu: sigungu,
        dongEubMyun: dongmyun,
      });
    } else {
      return alert("알 수 없는 오류");
    }
    setSido("");
    setSigungu("");
    setDongmyun("");
    setSigunguList([]);
    setDongmyunList([]);
    props.setModalType("");
    props.setModalOn(false);
  };
  return (
    <>
      <h2 className="text-center p-2 font-bold text-xl h-fit">
        {props.modalType === "areaA"
          ? "공고노출지역 1"
          : props.modalType === "areaB"
          ? "공고노출지역 2"
          : props.modalType === "areaC"
          ? "공고노출지역 3"
          : null}{" "}
        선택
      </h2>
      <div className="grid grid-cols-3 gap-x-2 min-w-[1000px]">
        <div className="p-2 font-bold bg-blue-100 text-center mb-2 h-fit">
          시/도
        </div>
        <div className="p-2 font-bold bg-blue-100 text-center mb-2 h-fit">
          시/군/구
        </div>
        <div className="p-2 font-bold bg-blue-100 text-center mb-2 h-fit">
          동/읍/면
        </div>
      </div>
      <div className="grid grid-cols-3 gap-x-2 min-w-[1000px] h-[80vh] overflow-hidden">
        <div className="grid grid-cols-2 gap-2 text-sm h-fit max-h-full  overflow-auto">
          {sidoList.map((item, idx) => (
            <button
              key={idx}
              className={`${
                sido === item
                  ? "bg-[#ffd700] hover:bg-opaticy-50"
                  : "bg-gray-100 hover:bg-gray-50"
              }  h-10`}
              onClick={() => setSido(item)}
            >
              {item}
            </button>
          ))}
        </div>
        {sigunguList.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-2 text-sm h-fit max-h-full  overflow-auto overflow-auto">
              {sigunguList.map((item, idx) => (
                <button
                  key={idx}
                  className={`${
                    sigungu === item
                      ? "bg-[#ffd700] hover:bg-opaticy-50"
                      : "bg-gray-100 hover:bg-gray-50"
                  }  h-10`}
                  onClick={() => setSigungu(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            {dongmyunList.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 text-sm h-fit max-h-full  overflow-auto">
                {dongmyunList.map((item, idx) => (
                  <button
                    key={idx}
                    className={`${
                      dongmyun === item
                        ? "bg-[#ffd700] hover:bg-opaticy-50"
                        : "bg-gray-100 hover:bg-gray-50"
                    } h-10`}
                    onClick={() => setDongmyun(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center pt-[120px]">
                시/군/구를 선택해 주세요
              </div>
            )}
          </>
        ) : (
          <div className="text-center col-span-2 pt-[120px]">
            시/도를 선택해 주세요
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-1 py-2">
        <div className="text-center py-2">
          {!sido && !sigungu && !dongmyun
            ? "지역을 선택하세요"
            : `${sido} ${sigungu} ${dongmyun}`}
        </div>
        <div className="grid grid-cols-3 gap-x-1">
          <button
            className="p-2 border border-green-500 bg-green-500 hover:border-green-600 hover:bg-green-600 text-white col-span-2"
            onClick={() => submit()}
          >
            등록
          </button>
          <button
            className="p-2 border bg-white hover:bg-gray-50"
            onClick={() => {
              setSido("");
              setSigungu("");
              setDongmyun("");
              setSigunguList([]);
              setDongmyunList([]);
              props.setModalType("");
              props.setModalOn(false);
            }}
          >
            취소
          </button>
        </div>
      </div>
    </>
  );
}

export default SearchArea;
