import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Reducer/userSlice";

import { useNavigate } from "react-router-dom";
import { api } from "../../Api/Api";

function Login() {
  const login = useSelector(state => state.user);
  const navi = useNavigate();
  const dispatch = useDispatch();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  useEffect(() => {
    console.log(login);
    if (login.userId) {
      console.log(login);
      navi("/admin");
    }
    //eslint-disable-next-line
  }, [login]);

  const loginAdmin = async e => {
    e.preventDefault();
    try {
      const data = {
        userId: id,
        userPwd: pw,
      };

      const res = await api
        .post("/api/v1/formMail_admin/login", {
          json: data,
        })
        .json();
      if (res.code === "C000") {
        dispatch(
          loginUser({
            userId: id,
            userName: res.formMailAdmin.rName,
            phone: res.formMailAdmin.mPhone,
            admin: res.formMailAdmin.admin,
          })
        );
      } else {
        return alert(res.message);
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
      <h2 className="text-lg mb-3">관리자 로그인</h2>
      <form onSubmit={loginAdmin}>
        <div className="mb-3">
          <label
            htmlFor="id"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            아이디를 입력해주세요
          </label>
          <input
            type="text"
            id="id"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
            value={id}
            onChange={e => setId(e.currentTarget.value)}
            onBlur={e => setId(e.currentTarget.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            비밀번호를 입력하세요(6글자 이상)
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
          관리자로그인
        </button>
      </form>
    </div>
  );
}

export default Login;
