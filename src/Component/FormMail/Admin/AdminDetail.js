import React, { useEffect, useState } from "react";
import DetailPhone from "./DetailPhone";
import DetailPhone2 from "./DetailPhone2";
import { useSelector } from "react-redux";
import { api } from "../../Api/Api";
import { useNavigate } from "react-router-dom";

function AdminDetail(props) {
  const navi = useNavigate();
  const login = useSelector(state => state.manager);
  const [rName, setRName] = useState("");
  const [userName, setUserName] = useState("");
  const [pwd, setPwd] = useState("");
  const [position, setPosition] = useState("");
  const [team, setTeam] = useState("");
  const [id, setId] = useState("");
  const [mPhone, setMPhone] = useState("");
  const [rPhone, setRPhone] = useState("");
  const [error, setError] = useState("");
  const [error2, setError2] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [beforeValue, setBeforeValue] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getInfo(props.detailId);
    //eslint-disable-next-line
  }, [props.detailId]);
  const getInfo = async id => {
    setLoaded(false);
    const data = {
      userId: id,
    };
    try {
      const res = await api
        .post("/api/v1/formMail_admin/findOneUser", {
          json: data,
        })
        .json();
      console.log(res);
      if (res.code === "C001") {
        setBeforeValue(res.userProfile);
      }
      const info = res.userProfile;
      setBeforeValue(info);
      setTeam(info.team);
      setPosition(info.position);
      setUserName(info.userName);
      setId(info.userId);
      setRName(info.rName);
      setMPhone(info.mPhone);
      setRPhone(info.rPhone);
      setIsAdmin(info.admin);
      setLoaded(true);
    } catch (error) {
      console.error("Error fetching admin list: ", error);
    }
  };

  // 체크박스 클릭 시 호출되는 핸들러
  const handleCheckboxChange = event => {
    setIsAdmin(event.target.checked); // 체크 여부에 따라 isAdmin 값 변경
  };

  const modify = async e => {
    e.preventDefault();
    const data = await modifyCheck();
    console.log(data);
    if (!data) {
      return false;
    }
    if (Object.keys(data).length === 0) {
      alert("수정된 내용이 없습니다");
      return false;
    }
    console.log(data);
    data.userId = id;
    data.admin = isAdmin;
    console.log(data);
    try {
      const res = await api
        .put("/api/v1/formMail_admin/updateUser", {
          json: data,
        })
        .json();
      alert(`관리자 정보수정 완료. (${res.code})`);
      if (props.isMypage) {
        navi("/main");
        return false;
      }
      props.setDetailId(null);
    } catch (error) {
      console.error("문서 업데이트 중 오류 발생: ", error);
    }
  };

  //기존값과 입력값이 다른지 비교하고 다른 경우만 추가
  const modifyCheck = () => {
    let data = {};
    if (!team) {
      alert("부서는 반드시 선택해야 합니다");
      return false;
    }
    if (userName && beforeValue.userName !== userName) {
      data.userName = userName;
    }
    if (position && beforeValue.position !== position) {
      data.position = position;
    }
    if (pwd && pwd.length > 5) {
      data.userPwd = pwd;
    }
    if (beforeValue.team !== team) {
      data.team = team;
    }
    if (mPhone && beforeValue.mPhone !== mPhone) {
      data.mPhone = mPhone;
    }
    if (rPhone && beforeValue.rPhone !== rPhone) {
      data.rPhone = rPhone;
    }
    if (beforeValue.admin !== isAdmin) {
      data.admin = isAdmin;
    }
    return data;
  };

  const handleBlurPwd = e => {
    const value = e.target.value;
    if (value.length < 6) {
      setError(true);
    } else {
      setPwd(value);
    }
  };

  return (
    <>
      {loaded ? (
        <form onSubmit={modify}>
          <div className="w-[99%] max-w-[600px] p-4 border flex flex-col justify-start gap-y-4 font-neo bg-white">
            <div className="flex flex-row justify-start gap-x-2">
              <label
                htmlFor="team"
                className="block text-sm font-neobold text-gray-900 dark:text-white min-w-[120px] p-1"
              >
                부서
              </label>
              <select
                type="text"
                id="team"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
                value={team}
                onChange={e => {
                  setTeam(e.currentTarget.value);
                }}
              >
                <option value="">부서선택</option>
                <option value="1">채용팀</option>
                <option value="2">광고팀</option>
                <option value="3">지원팀</option>
                <option value="4">운영팀</option>
                <option value="5">육성팀</option>
                <option value="0">관리자</option>
              </select>
            </div>
            <div className="flex flex-row justify-start gap-x-2">
              <label
                htmlFor="id"
                className="block p-1 text-sm font-neobold text-gray-900 dark:text-white min-w-[120px]"
              >
                아이디
              </label>
              <div className="p-1">{id}</div>
            </div>
            <div className="flex flex-row justify-start gap-x-2">
              <div className="block p-1 text-sm font-neobold text-gray-900 dark:text-white min-w-[120px]">
                비밀번호
              </div>
              {login.admin || login.userId === "admin" ? (
                <div className="flex flex-col w-full">
                  <input
                    type="password"
                    id="pwd"
                    className="block shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-full  p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
                    value={pwd}
                    onFocus={() => setError(false)}
                    onChange={e => setPwd(e.currentTarget.value)}
                    onBlur={handleBlurPwd}
                    placeholder="새 비밀번호를 입력하면 바로 수정됩니다"
                  />
                  {error && (
                    <div className="text-sm text-rose-500 p-1">
                      비밀번호 양식이 달라 변경되지 않습니다.
                    </div>
                  )}
                </div>
              ) : (
                <div className="block p-1 text-sm text-gray-900 dark:text-white min-w-[120px]">
                  비밀번호는 관리자만 변경 가능합니다
                </div>
              )}
            </div>
            <div className="flex flex-row justify-start gap-x-2">
              <div className="block p-1 text-sm font-neobold text-gray-900 dark:text-white min-w-[120px]">
                이름
              </div>
              <div className="block p-1 text-sm text-gray-900 dark:text-white min-w-[120px]">
                {rName}
              </div>
            </div>
            <div className="flex flex-row justify-start gap-x-2">
              <label
                htmlFor="userName"
                className="block p-1 text-sm font-neobold text-gray-900 dark:text-white min-w-[120px]"
              >
                업무명
              </label>
              <input
                type="text"
                id="userName"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full  p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
                value={userName}
                onChange={e => setUserName(e.currentTarget.value)}
                onBlur={e => setUserName(e.currentTarget.value)}
                placeholder="외부 노출시 이 이름으로 노출됩니다"
              />
            </div>
            <div className="flex flex-row justify-start gap-x-2">
              <label
                htmlFor="position"
                className="block p-1 text-sm font-neobold text-gray-900 dark:text-white min-w-[120px]"
              >
                직책
              </label>
              <input
                type="text"
                id="position"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full  p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
                value={position}
                onChange={e => setPosition(e.currentTarget.value)}
                onBlur={e => setPosition(e.currentTarget.value)}
              />
            </div>
            <DetailPhone2
              title={"연락처1"}
              id={"mPhone"}
              phone={mPhone}
              setPhone={setMPhone}
            />
            <DetailPhone
              title={"연락처2"}
              id={"rPhone"}
              phone={rPhone}
              error={error2}
              setPhone={setRPhone}
              setError={setError2}
            />

            <div className="flex items-center">
              <input
                id="isAdmin"
                type="checkbox"
                value={isAdmin}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                checked={isAdmin}
              />
              <label
                htmlFor="isAdmin"
                className="ms-2 font-neobold text-gray-900 dark:text-gray-300"
              >
                관리자 권한을 부여합니다
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-neobold rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
            >
              관리자 정보 수정
            </button>
          </div>
        </form>
      ) : (
        <div className="w-full h-[800px] relative">
          <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-12 h-12 text-gray-100 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDetail;
