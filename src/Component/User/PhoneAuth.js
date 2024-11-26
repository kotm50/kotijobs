import React, { useState } from "react";
import { api } from "../Api/Api";

function DetailPhone(props) {
  const [authOn, setAuthOn] = useState(false);
  const [authNum, setAuthNum] = useState("");
  const [authResult, setAuthResult] = useState("before");
  // 입력 값 변경 시 호출
  const handleChange = e => {
    const value = e.target.value;
    // 숫자와 하이픈만 남기기
    const filteredValue = value.replace(/[^0-9-]/g, "");
    props.setPhone(filteredValue);
    props.setError(""); // 입력 중에는 에러 메시지 초기화
  };

  // 입력 창이 focus 상태가 될 때 호출
  const handleFocus = () => {
    // 하이픈 제거하고 숫자만 남기기
    const plainNumber = props.phone.replace(/-/g, "");
    props.setPhone(plainNumber);
  };

  // 입력 창이 blur 상태가 될 때 호출
  const handleBlur = () => {
    if (props.phone) {
      // '010-0000-0000' 형식인 경우
      const validPhoneFormat = /^010-\d{4}-\d{4}$/;
      // '01000000000' 형식인 경우
      const plainPhoneFormat = /^010\d{8}$/;

      if (validPhoneFormat.test(props.phone)) {
        // 유효한 형식일 경우 아무 반응 없음
        props.setError("");
      } else if (plainPhoneFormat.test(props.phone)) {
        // 하이픈 없는 11자리 숫자인 경우, 하이픈 추가
        const formattedNumber = props.phone.replace(
          /(\d{3})(\d{4})(\d{4})/,
          "$1-$2-$3"
        );
        props.setPhone(formattedNumber);
        props.setError("");
      } else {
        // 그 외의 경우, 경고 메시지 표시
        props.setError("양식에 맞지 않습니다.");
      }
    }
  };

  const startAuth = async () => {
    if (props.userName === "" || props.phone === "") {
      return alert("이름과 연락처를 입력하세요");
    }
    const data = {
      phone: props.phone,
      userName: props.userName,
    };
    const res = await api
      .post("/api/v1/formMail/cert/sms", { json: data })
      .json();
    console.log(res);
    if (res.code === "C000") {
      setAuthOn(true);
    }
  };

  const submitAuth = async () => {
    if (authNum === "") {
      return alert("인증번호를 입력하세요");
    }
    const data = {
      phone: props.phone,
      userName: props.userName,
      smsCode: authNum,
    };
    const res = await api
      .post("/api/v1/jobsite/user/cert", { json: data })
      .json();
    console.log(res);
    if (res.code === "C000") {
      setAuthResult("success");
    } else {
      setAuthResult("fail");
    }
  };

  return (
    <>
      <div className="flex flex-row justify-start gap-x-2">
        <label
          htmlFor={props.id}
          className={`block px-1 py-1.5 min-w-[120px] text-sm font-neobold ${
            props.error
              ? "text-rose-500 dark:text-white"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {props.title}
        </label>
        <div className="w-full grid grid-cols-1">
          <div className="w-full grid grid-cols-3 gap-x-2">
            <input
              type="text"
              id={props.id}
              className={`shadow-sm border bg-gray-50 col-span-2 ${
                props.error ? "border-rose-500" : "border-gray-300"
              } text-gray-900 text-sm rounded focus:ring-indigo-500 focus:border-indigo-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light`}
              value={props.phone}
              onFocus={handleFocus}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="하이픈(-) 없이 숫자만 입력해주세요 01045451212"
              required={props.required}
              disabled={authOn}
            />
            <button
              type="button"
              className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-neobold rounded text-sm px-5 py-1.5 text-center dark:bg-indigo-600 dark:hover:bg-stone-500 dark:focus:ring-indigo-700"
              onClick={() => startAuth()}
            >
              인증번호받기
            </button>
          </div>
          {props.error && (
            <div className="text-rose-500 text-sm mt-1 mb-4">{props.error}</div>
          )}
        </div>
      </div>
      {authOn && (
        <div className="flex flex-row justify-start gap-x-2">
          <label
            htmlFor="authNum"
            className="block px-1 py-1.5 text-sm font-neobold text-gray-900 min-w-[120px]"
          >
            이름
          </label>
          <div className="w-full grid grid-cols-1">
            <div className="w-full grid grid-cols-3 gap-x-2">
              <input
                type="text"
                id="authNum"
                className="shadow-sm col-span-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-stone-500 focus:border-stone-500 block w-full  p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-stone-500 dark:focus:border-stone-500 dark:shadow-sm-light"
                value={authNum}
                onChange={e => setAuthNum(e.currentTarget.value)}
                onBlur={e => setAuthNum(e.currentTarget.value)}
                placeholder="인증번호"
                disabled={authResult === "success"}
              />

              <button
                type="button"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-neobold rounded text-sm px-5 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-stone-500 dark:focus:ring-blue-700"
                onClick={() => submitAuth()}
              >
                인증받기
              </button>
            </div>
            <div
              className={`${
                authResult === "success" ? "text-green-600" : "text-rose-500"
              } text-sm mt-1 mb-4`}
            >
              {authResult === "before"
                ? "휴대폰 번호로 인증번호가 전송되었습니다"
                : authResult === "fail"
                ? "인증에 실패했습니다. 번호를 다시 확인해 주세요"
                : "인증성공"}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DetailPhone;
