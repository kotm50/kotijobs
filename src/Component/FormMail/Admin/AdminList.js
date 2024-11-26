import React, { useState, useEffect } from "react";
import AdminDetail from "./AdminDetail";
import { api } from "../../Api/Api";

function AdminList() {
  const [adminList, setAdminList] = useState([]);
  const [detailId, setDetailId] = useState(null);

  useEffect(() => {
    if (!detailId) {
      fetchAdminList(); // 함수 호출
    }
  }, [detailId]); // 빈 배열을 전달하여 컴포넌트가 처음 마운트될 때만 실행

  // Firestore에서 데이터 가져오기
  const fetchAdminList = async () => {
    const data = { size: 999, page: 1 };
    try {
      const res = await api
        .post("/api/v1/formMail_admin/userList", { json: data })
        .json();
      setAdminList(res.userList);
    } catch (error) {
      console.error("Error fetching admin list: ", error);
    }
  };

  const getTeam = team => {
    switch (team) {
      case 0:
        return "관리자";
      case 1:
        return "채용팀";
      case 2:
        return "광고팀";
      case 3:
        return "지원팀";
      case 4:
        return "운영팀";
      case 5:
        return "육성팀";
      default:
        return "알 수 없는 팀"; // 해당되지 않는 숫자에 대한 기본 반환값
    }
  };
  return (
    <>
      <div
        className={`grid ${
          detailId ? "grid-cols-3" : "grid-cols-2"
        } gap-x-2 w-full`}
      >
        <div className="w-full col-span-2">
          <div className="text-center text-xl font-neoextra">파트너 리스트</div>
          {adminList && adminList.length > 0 ? (
            <table className="w-[90%] mx-auto">
              <thead>
                <tr>
                  <th className="bg-blue-500 text-white border p-1 text-center">
                    부서
                  </th>
                  <th className="bg-blue-500 text-white border p-1 text-center">
                    아이디
                  </th>
                  <th className="bg-blue-500 text-white border p-1 text-center">
                    이름
                  </th>
                  <th className="bg-blue-500 text-white border p-1 text-center">
                    업무명
                  </th>
                  <th className="bg-blue-500 text-white border p-1 text-center">
                    연락처
                  </th>
                  <th className="bg-blue-500 text-white border p-1 text-center">
                    임시연락처
                  </th>
                  <th className="bg-blue-500 text-white border p-1 text-center">
                    권한
                  </th>
                  <th className="bg-blue-500 text-white border p-1 text-center">
                    수정
                  </th>
                </tr>
              </thead>
              <tbody>
                {adminList.map((admin, idx) => (
                  <tr key={idx}>
                    <td
                      className="bg-white border p-1 text-center hover:cursor-pointer"
                      onClick={() => {
                        if (detailId && detailId === admin.userId) {
                          setDetailId(null);
                        } else {
                          setDetailId(admin.userId);
                        }
                      }}
                    >
                      {getTeam(Number(admin.team))}
                    </td>
                    <td
                      className="bg-white border p-1 text-center hover:cursor-pointer"
                      onClick={() => {
                        if (detailId && detailId === admin.userId) {
                          setDetailId(null);
                        } else {
                          setDetailId(admin.userId);
                        }
                      }}
                    >
                      {admin.userId}
                    </td>
                    <td
                      className="bg-white border p-1 text-center hover:cursor-pointer"
                      onClick={() => {
                        if (detailId && detailId === admin.userId) {
                          setDetailId(null);
                        } else {
                          setDetailId(admin.userId);
                        }
                      }}
                    >
                      {admin.rName}
                    </td>
                    <td
                      className="bg-white border p-1 text-center hover:cursor-pointer"
                      onClick={() => {
                        if (detailId && detailId === admin.userId) {
                          setDetailId(null);
                        } else {
                          setDetailId(admin.userId);
                        }
                      }}
                    >
                      {admin.userName}
                    </td>
                    <td
                      className="bg-white border p-1 text-center hover:cursor-pointer"
                      onClick={() => {
                        if (detailId && detailId === admin.userId) {
                          setDetailId(null);
                        } else {
                          setDetailId(admin.userId);
                        }
                      }}
                    >
                      {admin.mPhone}
                    </td>
                    <td
                      className="bg-white border p-1 text-center hover:cursor-pointer"
                      onClick={() => {
                        if (detailId && detailId === admin.userId) {
                          setDetailId(null);
                        } else {
                          setDetailId(admin.userId);
                        }
                      }}
                    >
                      {admin.rPhone}
                    </td>
                    <td
                      className="bg-white border p-1 text-center hover:cursor-pointer"
                      onClick={() => {
                        if (detailId && detailId === admin.userId) {
                          setDetailId(null);
                        } else {
                          setDetailId(admin.userId);
                        }
                      }}
                    >
                      {admin.admin ? "관리자" : "일반"}
                    </td>
                    <td
                      className="bg-white border p-1 text-center hover:cursor-pointer"
                      onClick={() => {
                        if (detailId && detailId === admin.userId) {
                          setDetailId(null);
                        } else {
                          setDetailId(admin.userId);
                        }
                      }}
                    >
                      <button
                        className="w-[120px] mx-auto py-1 px-2 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          if (detailId && detailId === admin.userId) {
                            setDetailId(null);
                          } else {
                            setDetailId(admin.userId);
                          }
                        }}
                      >
                        {detailId && detailId === admin.userId
                          ? "창닫기"
                          : "수정하기"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
        </div>
        {detailId && (
          <div className="relative min-h-[500px] h-full">
            <div className="sticky top-10 left-0 min-w-[100px] min-h-[100px] w-full h-fit">
              <div className="text-center text-xl font-neoextra">
                파트너 정보수정
              </div>
              <AdminDetail
                detailId={detailId}
                fetchAdminList={fetchAdminList}
                setDetailId={setDetailId}
              />
            </div>
          </div>
        )}
        <div></div>
      </div>
    </>
  );
}

export default AdminList;
