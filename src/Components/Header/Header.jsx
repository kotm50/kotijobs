import { Link } from "react-router-dom";
import { useLogout } from "../../Api/Api";

function Header({ thisLocation }) {
  const logout = useLogout();
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
                onClick={logout}
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
