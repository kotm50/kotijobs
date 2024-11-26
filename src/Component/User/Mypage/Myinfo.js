import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { api } from "../../Api/Api";
import PopupDom from "../../../Kakao/PopupDom";
import PopupPostCode from "../../../Kakao/PopupPostCode";
import PhoneAuth from "../PhoneAuth";
import { useSelector } from "react-redux";

function MyInfo() {
  const login = useSelector(state => state.user);
  const navi = useNavigate();
  const [userName, setUserName] = useState("");
  const [birth, setBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

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

  useEffect(() => {
    console.log("시도", sido);
    console.log("시군구", sigungu);
  }, [sido, sigungu]);

  useEffect(() => {
    if (login.userId) {
      getUserInfo();
    }
    //eslint-disable-next-line
  }, [login]);

  const getUserInfo = async () => {
    const data = {
      userId: login.userId,
    };

    const res = await api
      .post("/api/v1/jobsite/user/findOne", { json: data })
      .json();
    console.log(res);
  };

  const handleGenderChange = e => {
    setGender(e.target.value);
  };

  const getData = () => {
    let data = {
      userId: login.userId,
    };
    return data;
  };

  const userEdit = async e => {
    e.preventDefault();
    const data = getData();
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
            개인정보 수정
          </h3>
          <form onSubmit={userEdit}>
            <div className="p-4 border bg-white flex flex-col justify-start gap-y-4 max-w-[600px] mx-auto">
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
              <button
                type="submit"
                className="mt-2 text-white bg-orange-600 hover:bg-orange-700 focus:ring-4 focus:outline-none focus:ring-orange-300 font-neobold rounded text-sm px-5 py-2.5 text-center dark:bg-orange-600 dark:hover:bg-stone-500 dark:focus:ring-orange-700"
              >
                수정
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

export default MyInfo;
