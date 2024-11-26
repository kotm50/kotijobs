import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { api } from "../Api/Api";
import PopupDom from "../../Kakao/PopupDom";
import PopupPostCode from "../../Kakao/PopupPostCode";
import Privacy from "../Doc/Privacy";
import PhoneAuth from "./PhoneAuth";

function Join() {
  const navi = useNavigate();
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const [rePwd, setRepwd] = useState("");
  const [userName, setUserName] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [isAgree, setIsAgree] = useState(false);

  const chkId = e => {
    const str = e.target.value;
    if (e.target.value === "") {
      setIdErr("");
      return false;
    }
    const lengthValid = str.length >= 4 && str.length <= 16;
    const startsWithLowercase = /^[a-z]/.test(str);
    const validCharacters = /^[a-z0-9-_]+$/.test(str);
    if (!lengthValid) {
      setIdErr("아이디는 4자 이상 16자 이하입니다");
      return false;
    }
    if (!startsWithLowercase) {
      setIdErr("아이디는 반드시 영어 소문자로 시작해야 합니다");
      return false;
    }
    if (!validCharacters) {
      setIdErr(
        "아이디는 영어 소문자, 숫자, 하이픈(-), 언더바(_)만 입력 가능합니다"
      );
      return false;
    }
    setIdErr("");
  };

  const chkPwd = e => {
    const str = e.target.value;
    if (e.target.value === "") {
      setPwdErr("");
      return false;
    }
    if (userPwd !== str) {
      setPwdErr("비밀번호가 일치하지 않습니다 다시 입력해 주세요");
    }
  };

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
  const [addrDetail, setAddrDetail] = useState("");
  const [sido, setSido] = useState("");
  const [sigungu, setSigungu] = useState("");

  const [error, setError] = useState("");

  const [idErr, setIdErr] = useState("");
  const [pwdErr, setPwdErr] = useState("");

  useEffect(() => {
    console.log("시도", sido);
    console.log("시군구", sigungu);
  }, [sido, sigungu]);

  const handleGenderChange = e => {
    setGender(e.target.value);
  };

  /*
  const getAdInfo = async aid => {
    const data = {
      aid: aid,
    };
    //console.log(data);

    const res = await api
      .post("/api/v1/formMail_ad/findOneJobsite", { json: data })
      .json();
    //console.log(res);
    setAdTitle(res.jobSiteList[0].title);

    const res2 = await api
      .post("/api/v1/formMail_ad/findCompanyAndUser", { json: data })
      .json();
    const info = res2.findCompanyAndUserList;
    setCompanyName(`${info[0].companyName}`);
    setPartner(`${info[0].userName}(${info[0].rName}) ${info[0].position}`);
    setCompanyId(info[0].cid || "");
    setUserId(info[0].userId || "");
    setAdNum(info[0].adNum || "");
  };
  */

  const chkData = () => {
    if (!isAgree) {
      return "개인정보 수집이용에 동의하셔야 지원이 가능합니다";
    }
    if (!userName) {
      return "이름을 입력해 주세요";
    }
    if (!userPwd) {
      return "비밀번호를 입력해 주세요";
    }
    if (pwdErr) {
      return "비밀번호를 다시 확인해 주세요";
    }
    if (!birth) {
      return "생년월일을 입력해 주세요";
    }
    if (!phone) {
      return "연락처를 입력해 주세요";
    }
    if (error) {
      return "연락처를 양식에 맞춰 입력해 주세요";
    }
    if (!address) {
      return "거주지를 입력하세요";
    }
    if (!gender) {
      return "성별을 선택 해 주세요";
    }
    return "완료";
  };

  const userJoin = async e => {
    e.preventDefault();
    const chk = await chkData();
    if (chk !== "완료") {
      return alert(chk);
    }
    const data = {
      userId,
      userPwd,
      userName,
      phone,
      address,
      addressDetail,
      sido,
      sigungu,
      gender,
      birth,
    };
    //console.log(data);
    try {
      const res = await api
        .post("/api/v1/jobsite/user/join", { json: data })
        .json();
      console.log(res);
      if (res.code === "C000") {
        alert("회원가입이 완료되었습니다");
        navi("/");
        return true;
      }
    } catch {
      console.error("Error fetching admin list: ", error);
    }
  };

  const handleBirth = e => {
    const value = e.target.value;
    if (value === "") {
      return false;
    }
    // 숫자인지 확인
    const isNumeric = /^\d+$/.test(value);

    if (!isNumeric) {
      alert("숫자만 입력 가능합니다.");
      setBirth("");
      return;
    }

    // 첫 두 글자가 19 또는 20으로 시작하는지 확인
    if (value.length === 4 || value.length === 8) {
      const firstTwoDigits = value.slice(0, 2);
      if (firstTwoDigits !== "19" && firstTwoDigits !== "20") {
        alert("잘못된 입력입니다. '19' 또는 '20'으로 시작해야 합니다.");
        setBirth(""); // 값 초기화
        return;
      }
    } else {
      alert("잘못된 입력입니다. 4자리 또는 8자리 숫자로 입력해 주세요");
      setBirth(""); // 값 초기화
      return;
    }

    // 4자리일 때 '0000'을 붙이는 로직
    if (value.length === 4) {
      setBirth(`${value}0000`);
    } else {
      setBirth(value);
    }
  };
  return (
    <>
      <div className="w-full lg:max-w-[1400px] max-w-[95vw] mx-auto pt-10">
        <div className="w-full">
          <h3 className="text-center font-neoextra text-lg mb-3 w-full">
            입력
          </h3>
          <form onSubmit={userJoin}>
            <div className="p-4 border bg-white flex flex-col justify-start gap-y-4 max-w-[600px] mx-auto">
              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="userId"
                  className="block px-1 py-1.5 text-sm font-neobold text-gray-900 min-w-[120px]"
                >
                  아이디
                </label>
                <div className="w-full flex flex-col justify-start gap-y-2">
                  <input
                    type="text"
                    id="userId"
                    className={`shadow-sm bg-gray-50 border ${
                      idErr.length > 0
                        ? "border-rose-500 text-rose-500"
                        : "border-gray-300 text-gray-900"
                    } text-sm rounded focus:ring-stone-500 focus:border-stone-500 block w-full  p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-stone-500 dark:focus:border-stone-500 dark:shadow-sm-light`}
                    value={userId}
                    onFocus={() => setIdErr("")}
                    onChange={e => setUserId(e.currentTarget.value)}
                    onBlur={chkId}
                    placeholder="아이디를 입력하세요"
                  />
                  {idErr.length > 0 && (
                    <span className="text-rose-500 text-xs">{idErr}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="userName"
                  className="block px-1 py-1.5 text-sm font-neobold text-gray-900 min-w-[120px]"
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  id="userPwd"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-stone-500 focus:border-stone-500 block w-full  p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-stone-500 dark:focus:border-stone-500 dark:shadow-sm-light"
                  value={userPwd}
                  onChange={e => setUserPwd(e.currentTarget.value)}
                  onBlur={e => setUserPwd(e.currentTarget.value)}
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="rePwd"
                  className="block px-1 py-1.5 text-sm font-neobold text-gray-900 min-w-[120px]"
                >
                  비밀번호 확인
                </label>
                <div className="w-full flex flex-col justify-start gap-y-2">
                  <input
                    type="password"
                    id="rePwd"
                    className={`shadow-sm bg-gray-50 border ${
                      pwdErr.length > 0
                        ? "border-rose-500 text-rose-500"
                        : "border-gray-300 text-gray-900"
                    } text-sm rounded focus:ring-stone-500 focus:border-stone-500 block w-full  p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-stone-500 dark:focus:border-stone-500 dark:shadow-sm-light`}
                    value={rePwd}
                    onFocus={() => setPwdErr("")}
                    onChange={e => setRepwd(e.currentTarget.value)}
                    onBlur={chkPwd}
                    placeholder="아이디를 입력하세요"
                  />
                  {pwdErr.length > 0 && (
                    <span className="text-rose-500 text-xs">{pwdErr}</span>
                  )}
                </div>
              </div>
              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="userName"
                  className="block px-1 py-1.5 text-sm font-neobold text-gray-900 min-w-[120px]"
                >
                  이름
                </label>
                <input
                  type="text"
                  id="userName"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-stone-500 focus:border-stone-500 block w-full  p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-stone-500 dark:focus:border-stone-500 dark:shadow-sm-light"
                  value={userName}
                  onChange={e => setUserName(e.currentTarget.value)}
                  onBlur={e => setUserName(e.currentTarget.value)}
                  placeholder="이름"
                />
              </div>
              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="birth"
                  className="block px-1 py-1.5 text-sm font-neobold text-gray-900 min-w-[120px]"
                >
                  생년월일
                </label>
                <input
                  type="text"
                  id="birth"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-stone-500 focus:border-stone-500 block w-full  p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-stone-500 dark:focus:border-stone-500 dark:shadow-sm-light"
                  value={birth}
                  onChange={e => setBirth(e.currentTarget.value)}
                  onBlur={handleBirth}
                  placeholder="생년월일 8자리, 또는 태어난 해 4자리"
                />
              </div>
              <PhoneAuth
                title={"연락처"}
                id={"phone"}
                phone={phone}
                error={error}
                setPhone={setPhone}
                setError={setError}
                userName={userName}
              />

              <div className="flex gap-x-2">
                <div className="block p-1 text-sm font-neobold text-gray-900 min-w-[120px]">
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
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <label
                      htmlFor="gender_1"
                      className="ms-1 text-sm font-medium text-gray-900"
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
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    />
                    <label
                      htmlFor="gender_2"
                      className="ms-1 text-sm font-medium text-gray-900"
                    >
                      남자
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-start gap-x-2">
                <label
                  htmlFor="address"
                  className="block px-1 py-1.5 text-sm font-neobold text-gray-900 min-w-[120px]"
                >
                  거주지 주소
                </label>
                <input
                  type="text"
                  id="address"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-stone-500 focus:border-stone-500 block w-full  p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-stone-500 dark:focus:border-stone-500 dark:shadow-sm-light"
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
                    htmlFor="addrDetail"
                    className="block p-1 text-sm font-neobold text-gray-900 min-w-[120px]"
                  >
                    상세주소
                  </label>
                  <input
                    type="text"
                    id="addrDetail"
                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-stone-500 focus:border-stone-500 block w-full  p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-stone-500 dark:focus:border-stone-500 dark:shadow-sm-light"
                    value={addrDetail}
                    onChange={e => setAddrDetail(e.currentTarget.value)}
                    onBlur={e => setAddrDetail(e.currentTarget.value)}
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
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                    checked={isAgree}
                  />
                  <label
                    htmlFor="agree"
                    className="ms-1 text-sm font-medium text-gray-900"
                  >
                    개인정보 수집 및 이용에 동의합니다
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="mt-2 text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-neobold rounded text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-stone-500 dark:focus:ring-orange-700"
              >
                입력
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
                  setSido={setSido}
                  setSigungu={setSigungu}
                />
              </PopupDom>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Join;
