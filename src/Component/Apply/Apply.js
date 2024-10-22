import React, { useEffect, useState } from "react";
import DetailPhone from "./DetailPhone";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import ky from "ky";
import PopupDom from "../../Kakao/PopupDom";
import PopupPostCode from "../../Kakao/PopupPostCode";
import Privacy from "../Doc/Privacy";

function Apply() {
  const navi = useNavigate();
  const thisLocation = useLocation();
  const parsed = queryString.parse(thisLocation.search);
  const aid = parsed.aid || null;
  const [adNum, setAdNum] = useState("");
  const [adTitle, setAdTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [partner, setPartner] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [userId, setUserId] = useState("");
  const [applyName, setApplyName] = useState("");
  const [applyBirth, setApplyBirth] = useState("");
  const [applyPhone, setApplyPhone] = useState("");
  const [gender, setGender] = useState("");
  const [isAgree, setIsAgree] = useState(false);

  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // 팝업창 열기
  const openPostCode = () => {
    setIsPopupOpen(true);
  };

  // 팝업창 닫기
  const closePostCode = () => {
    setIsPopupOpen(false);
  };

  const [addressDetail, setAddressDetail] = useState(false);
  const [address, setAddress] = useState("");
  const [addr, setAddr] = useState("");

  const [error, setError] = useState("");

  const handleGenderChange = e => {
    setGender(e.target.value);
  };

  useEffect(() => {
    //console.log(aid);
    if (aid) {
      getAdInfo(aid);
    }
  }, [aid]);

  const getAdInfo = async aid => {
    const data = {
      aid: aid,
    };
    //console.log(data);

    const res = await ky
      .post("/api/v1/formMail_ad/findOneJobsite", { json: data })
      .json();
    //console.log(res);
    setAdTitle(res.jobSiteList[0].title);

    const res2 = await ky
      .post("/api/v1/formMail_ad/findCompanyAndUser", { json: data })
      .json();
    const info = res2.findCompanyAndUserList;
    setCompanyName(`${info[0].companyName}`);
    setPartner(`${info[0].userName}(${info[0].rName}) ${info[0].position}`);
    setCompanyId(info[0].cid || "");
    setUserId(info[0].userId || "");
    setAdNum(info[0].adNum || "");
  };

  const chkData = () => {
    if (!isAgree) {
      return "개인정보 수집이용에 동의하셔야 지원이 가능합니다";
    }
    if (!applyName) {
      return "지원자 이름을 입력해 주세요";
    }
    if (!applyBirth) {
      return "지원자 생년월일을 입력해 주세요";
    }
    if (!applyPhone) {
      return "지원자 연락처를 입력해 주세요";
    }
    if (error) {
      return "연락처를 양식에 맞춰 입력해 주세요";
    }
    if (!address) {
      return "지원자 거주지를 입력하세요";
    }
    if (!gender) {
      return "지원자 성별을 선택 해 주세요";
    }
    return "완료";
  };

  const addApply = async e => {
    e.preventDefault();
    const chk = await chkData();
    if (chk !== "완료") {
      return alert(chk);
    }
    const data = {
      aid: aid,
      cid: companyId,
      userId: userId,
      company: companyName,
      adNum: adNum,
      title: adTitle,
      partner: partner,
      applyName: applyName,
      applyPhone: applyPhone,
      applyAddress: addr ? `${address} ${addr}` : address,
      applyGender: gender,
      applyBirth: applyBirth,
    };
    //console.log(data);
    try {
      const res = await ky
        .post("/api/v1/formMail_apply/addApply", { json: data })
        .json();
      //console.log(res);
      if (res.code === "C000") {
        alert(
          "지원이 완료되었습니다. 빠른시일내에 연락 드리겠습니다\n지원해 주셔서 감사합니다"
        );
        navi("/");
        return true;
      }
    } catch {
      console.error("Error fetching admin list: ", error);
    }
  };

  const handleBirth = e => {
    const value = e.target.value;
    // 숫자인지 확인
    const isNumeric = /^\d+$/.test(value);

    if (!isNumeric) {
      alert("숫자만 입력 가능합니다.");
      setApplyBirth("");
      return;
    }

    // 첫 두 글자가 19 또는 20으로 시작하는지 확인
    if (value.length === 4 || value.length === 8) {
      const firstTwoDigits = value.slice(0, 2);
      if (firstTwoDigits !== "19" && firstTwoDigits !== "20") {
        alert("잘못된 입력입니다. '19' 또는 '20'으로 시작해야 합니다.");
        setApplyBirth(""); // 값 초기화
        return;
      }
    } else {
      alert("잘못된 입력입니다. 4자리 또는 8자리 숫자로 입력해 주세요");
      setApplyBirth(""); // 값 초기화
      return;
    }

    // 4자리일 때 '0000'을 붙이는 로직
    if (value.length === 4) {
      setApplyBirth(`${value}0000`);
    } else {
      setApplyBirth(value);
    }
  };
  return (
    <>
      <div className="w-full lg:max-w-[1400px] max-w-[95vw] mx-auto pt-10">
        <div className="w-full">
          <h3 className="text-center font-neoextra text-lg mb-3 w-full">
            지원자 입력
          </h3>
          <form onSubmit={addApply}>
            <div className="p-4 border bg-white flex flex-col justify-start gap-y-4 max-w-[600px] mx-auto">
              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="adTitle"
                  className="block px-1 py-1.5 text-sm font-neobold text-gray-900 dark:text-white min-w-[120px]"
                >
                  광고제목
                </label>
                <input
                  type="text"
                  id="adTitle"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full  p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 dark:shadow-sm-light"
                  value={adTitle}
                  onChange={e => e.preventDefault()}
                  placeholder="광고 제목"
                />
              </div>

              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="applyName"
                  className="block px-1 py-1.5 text-sm font-neobold text-gray-900 dark:text-white min-w-[120px]"
                >
                  이름
                </label>
                <input
                  type="text"
                  id="applyName"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full  p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 dark:shadow-sm-light"
                  value={applyName}
                  onChange={e => setApplyName(e.currentTarget.value)}
                  onBlur={e => setApplyName(e.currentTarget.value)}
                  placeholder="지원자 이름"
                />
              </div>

              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="applyBirth"
                  className="block px-1 py-1.5 text-sm font-neobold text-gray-900 dark:text-white min-w-[120px]"
                >
                  생년월일
                </label>
                <input
                  type="text"
                  id="applyBirth"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-orange-500 focus:border-orange-500 block w-full  p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500 dark:shadow-sm-light"
                  value={applyBirth}
                  onChange={e => setApplyBirth(e.currentTarget.value)}
                  onBlur={handleBirth}
                  placeholder="생년월일 8자리, 또는 태어난 해 4자리"
                />
              </div>
              <div className="flex gap-x-2">
                <div className="block p-1 text-sm font-neobold text-gray-900 dark:text-white min-w-[120px]">
                  성별
                </div>
                <div className="flex flex-wrap gap-y-4 gap-x-4">
                  <div className="flex items-center">
                    <input
                      checked={gender === "여자"}
                      id="gender_1"
                      type="radio"
                      value="여자"
                      onChange={handleGenderChange}
                      name="inline-radio-group"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="gender_1"
                      className="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      여자
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      checked={gender === "남자"}
                      id="gender_2"
                      type="radio"
                      value="남자"
                      onChange={handleGenderChange}
                      name="inline-radio-group"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="gender_2"
                      className="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      남자
                    </label>
                  </div>
                </div>
              </div>
              <DetailPhone
                title={"지원자 연락처"}
                id={"applyPhone"}
                phone={applyPhone}
                error={error}
                setPhone={setApplyPhone}
                setError={setError}
              />

              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="address"
                  className="block px-1 py-1.5 text-sm font-neobold text-gray-900 dark:text-white min-w-[120px]"
                >
                  거주지 주소
                </label>
                <input
                  type="text"
                  id="address"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full  p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
                  value={address}
                  onChange={e => e.preventDefault()}
                  placeholder="클릭하여 주소 입력"
                  onClick={() => openPostCode()}
                  onFocus={() => openPostCode()}
                  autoComplete="off"
                />
              </div>
              {addressDetail && (
                <div data="상세주소" className="flex justify-start gap-x-2">
                  <label
                    htmlFor="addr"
                    className="block p-1 text-sm font-neobold text-gray-900 dark:text-white min-w-[120px]"
                  >
                    상세주소
                  </label>
                  <input
                    type="text"
                    id="addr"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full  p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
                    value={addr}
                    onChange={e => setAddr(e.currentTarget.value)}
                    onBlur={e => setAddr(e.currentTarget.value)}
                    placeholder="상세 주소지를 입력하세요"
                  />
                </div>
              )}
              <hr />
              <div className="mt-5 grid grid-cols-1 gap-y-2">
                <h4 className="text-lg font-bold">개인정보 수집 이용동의</h4>
                <div className="bg-gray-100 border p-2">
                  <div className=" h-[120px] overflow-auto bg-white p-2">
                    <Privacy />
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    id="agree"
                    type="checkbox"
                    value={isAgree}
                    onChange={() => setIsAgree(!isAgree)}
                    name="agree-check"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    checked={isAgree}
                  />
                  <label
                    htmlFor="agree"
                    className="ms-1 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    개인정보 수집 및 이용에 동의합니다
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="mt-2 text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-neobold rounded text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-orange-500 dark:focus:ring-orange-700"
              >
                지원자 입력
              </button>
            </div>
          </form>

          <div id="popupDom" className={isPopupOpen ? "popupModal" : undefined}>
            {isPopupOpen && (
              <PopupDom>
                <PopupPostCode
                  onClose={closePostCode}
                  setAddress={setAddress}
                  setInputAddress={setAddressDetail}
                />
              </PopupDom>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Apply;
