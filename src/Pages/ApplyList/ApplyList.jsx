import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../../Api/Api";
import queryString from "query-string";
import dayjs from "dayjs";
import Pagenation from "../../Components/Pagenation";

function ApplyList() {
  const [applyList, setApplyList] = useState([]);
  const [last, setLast] = useState(1);
  const thisLocation = useLocation();
  const parsed = queryString.parse(thisLocation.search);

  const page = parsed.page || 1;
  const size = parsed.size || 20;
  //const status = parsed.status || "all";
  //const keyword = parsed.keyword || "";
  //const searchtype = parsed.searchtype || "";

  useEffect(() => {
    getApplyList();
    //eslint-disable-next-line
  }, [thisLocation]);

  const getApplyList = async () => {
    const data = {
      page: page,
      size: size,
    };
    const res = await api
      .post("/api/v1/jobsite/user/findAll", { json: data })
      .json();
    setApplyList(res.jobsiteUserList || []);
    setLast(res.totalPages || 1);
  };

  const getAge = b => {
    const today = new Date();
    const birth = b;
    let age = 0;

    const year1 = dayjs(today).year();
    const year2 = dayjs(birth).year();

    age = year1 - year2;

    const date1 = dayjs(today).format("MM-DD");
    const date2 = dayjs(b).format("MM-DD");

    if (dayjs(date2).isAfter(date1)) age = age - 1;
    return age;
  };
  const getPhone = phoneNumber => {
    // 숫자만 남기기
    const digits = phoneNumber.replace(/\D/g, "");

    // 형식에 맞춰 변환
    if (digits.length === 11) {
      // 010-0000-0000 형식
      return digits.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else if (digits.length === 10) {
      // 02-000-0000 또는 02-0000-0000 형식
      return digits.replace(/(\d{2})(\d{3,4})(\d{4})/, "$1-$2-$3");
    } else {
      // 유효하지 않은 번호일 경우 그대로 반환
      return phoneNumber;
    }
  };
  return (
    <>
      <div className="bg-white mx-auto py-10 px-5 text-sm">
        <h2 className="lg:text-2xl font-extra text-[#069]">회원 목록</h2>
        {applyList && applyList.length > 0 && (
          <>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="bg-gray-200 p-1 border border-gray-300 text-center">
                    회원구분
                  </th>
                  <th className="bg-gray-200 p-1 border border-gray-300 text-center">
                    아이디
                  </th>
                  <th className="bg-gray-200 p-1 border border-gray-300 text-center">
                    이름(성별,나이)
                  </th>
                  <th className="bg-gray-200 p-1 border border-gray-300 text-center">
                    연락처/이메일
                  </th>
                  <th className="bg-gray-200 p-1 border border-gray-300 text-center">
                    포인트
                  </th>
                  <th className="bg-gray-200 p-1 border border-gray-300 text-center">
                    이력서
                  </th>
                  <th className="bg-gray-200 p-1 border border-gray-300 text-center">
                    입사지원
                  </th>
                  <th className="bg-gray-200 p-1 border border-gray-300 text-center">
                    상태
                  </th>
                  <th className="bg-gray-200 p-1 border border-gray-300 text-center">
                    가입일
                  </th>
                  <th className="bg-gray-200 p-1 border border-gray-300 text-center">
                    관리
                  </th>
                </tr>
              </thead>
              <tbody>
                {applyList.map((apply, idx) => (
                  <tr key={idx}>
                    <td className="align-middle py-1 px-2 border border-gray-300 text-center">
                      개인회원
                    </td>
                    <td
                      className="align-middle py-1 px-2 border border-gray-300 max-w-[100px] overflow-hidden whitespace-nowrap text-ellipsis text-center"
                      title={apply.userId}
                    >
                      {apply.userId}
                    </td>
                    <td className="align-middle p-1 border border-gray-300 text-center">
                      {apply.userName} ({apply.gender}, {getAge(apply.birth)}세)
                    </td>
                    <td className="align-middle p-1 border border-gray-300 text-center">
                      <p>{getPhone(apply.phone)}</p>
                      <p className="text-xs">
                        {apply.email || "이메일 미등록"}
                      </p>
                    </td>
                    <td className="align-middle p-1 border border-gray-300 text-center">
                      0
                    </td>
                    <td className="align-middle p-1 border border-gray-300 text-center">
                      0
                    </td>
                    <td className="align-middle p-1 border border-gray-300 text-center">
                      0
                    </td>
                    <td className="align-middle p-1 border border-gray-300 text-center">
                      0
                    </td>
                    <td className="align-middle p-1 border border-gray-300 text-center">
                      {apply.createdAt}
                    </td>
                    <td className="align-middle p-1 border border-gray-300 text-center">
                      <div className="flex flex-row justify-start gap-x-2 flex-wrap">
                        <button
                          className="py-1 px-2 border hover:bg-gray-100 text-sm"
                          onClick={() => alert("준비 중입니다")}
                        >
                          수정
                        </button>
                        <button
                          className="py-1 px-2 border hover:bg-gray-100 text-sm"
                          onClick={() => alert("준비 중입니다")}
                        >
                          문자
                        </button>
                        <button
                          className="py-1 px-2 border hover:bg-gray-100 text-sm"
                          onClick={() => alert("준비 중입니다")}
                        >
                          메일
                        </button>
                        <button
                          className="py-1 px-2 border hover:bg-gray-100 text-sm"
                          onClick={() => alert("준비 중입니다")}
                        >
                          메모
                        </button>
                        <button
                          className="py-1 px-2 border hover:bg-gray-100 text-sm"
                          onClick={() => alert("준비 중입니다")}
                        >
                          로그인
                        </button>
                        <button
                          className="py-1 px-2 border hover:bg-gray-100 text-sm"
                          onClick={() => alert("준비 중입니다")}
                        >
                          탈퇴
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {applyList && applyList.length > 0 ? <Pagenation last={last} /> : null}
      </div>
    </>
  );
}

export default ApplyList;
