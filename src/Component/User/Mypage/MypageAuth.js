import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { api, useLogout } from "../../Api/Api";
import { useNavigate } from "react-router-dom";

function MypageAuth() {
  const login = useSelector(state => state.user);
  const navi = useNavigate();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  useEffect(() => {
    console.log(login.userId);
    if (!login.userId) {
      alert("잘못된 경로로 진입하셨습니다");
      navi("/");
    } else {
      setId(login.userId);
    }
    //eslint-disable-next-line
  }, [login]);
  const handleLogout = useLogout();

  const loginAdmin = async e => {
    e.preventDefault();
    try {
      const data = {
        userId: id,
        userPwd: pw,
      };

      const res = await api
        .post("/api/v1/jobsite/user/login", {
          json: data,
        })
        .json();
      console.log(res);
      if (res.code === "C001") {
        navi("/mypage/edit");
      } else {
        alert("세션이 만료되었습니다. 다시 로그인 해 주세요");
        handleLogout();
      }
    } catch (error) {
      console.log(error.code + " : " + error.message);
      alert("로그인 중 문제가 발생했습니다.");
    }
  };

  return (
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
    p-3 bg-white rounded-lg min-w-1 min-h-1 drop-shadow-lg w-11/12 lg:w-2/6"
    >
      <h2 className="text-lg mb-3">로그인</h2>
      <form onSubmit={loginAdmin}>
        <div className="mb-3">
          <label
            htmlFor="id"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            아이디
          </label>
          <input
            type="text"
            id="id"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
            value={id}
            onChange={e => setId(e.currentTarget.value)}
            onBlur={e => setId(e.currentTarget.value)}
            disabled
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            비밀번호를 다시 입력하세요
          </label>
          <input
            type="password"
            id="password"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
            value={pw}
            onChange={e => setPw(e.currentTarget.value)}
            onBlur={e => setPw(e.currentTarget.value)}
            autoComplete="off"
            required
          />
        </div>
        <button
          type="submit"
          className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
        >
          비밀번호확인
        </button>
      </form>
    </div>
  );
}

export default MypageAuth;
