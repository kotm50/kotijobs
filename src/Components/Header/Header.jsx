import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUser } from "../../Reducer/userSlice";

function Header({ thisLocation }) {
  const navi = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      dispatch(clearUser()); // Redux 상태 초기화
      if (thisLocation.pathname !== "/") {
        navi("/"); // 로그아웃 후 홈 화면으로 리디렉션
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
      // 오류 처리 로직 추가 가능
    }
  };
  return (
    <>
      {thisLocation.pathname !== "/" ? (
        <header className="fixed top-0 left-0 w-full bg-white drop-shadow z-[500]">
          <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1">
            <div className="py-2 px-6 text-xl font-bold text-success">
              코티잡 관리자 페이지
            </div>
            <div className="flex justify-between">
              <div className="flex flex-row justify-start gap-x-2 p-2">
                <Link
                  to="/admin/adinput"
                  className="hover:bg-warning py-2 px-4 rounded-full"
                >
                  공고등록
                </Link>
                <Link
                  to="/admin/adlist"
                  className="hover:bg-warning py-2 px-4 rounded-full"
                >
                  공고관리
                </Link>
                <Link
                  to="/admin"
                  className="hover:bg-warning py-2 px-4 rounded-full"
                >
                  채용담당자 관리
                </Link>
              </div>
              <button
                className="hover:bg-warning py-2 px-4 rounded-full"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </div>
          </div>
        </header>
      ) : null}
    </>
  );
}

export default Header;
