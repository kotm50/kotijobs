import { Link } from "react-router-dom";
import { useLogout } from "../../Api/Api";

function Header({ thisLocation }) {
  const logout = useLogout();
  return (
    <>
      {thisLocation.pathname !== "/" ? (
        <header className="fixed top-0 left-0 w-full bg-white drop-shadow z-[500] h-[120px] flex flex-col justify-between">
          <div className="w-full max-w-[1400px] mx-auto flex flex-row">
            <h1 className="px-6 text-xl font-bold text-success w-[200px] flex flex-col justify-center">
              코리아티엠
              <br />
              종합전산
            </h1>
            <div className="flex flex-col justify-between w-full">
              <div className="flex flex-row justify-start px-2">
                <button
                  className="p-4 hover:bg-blue-100"
                  onClick={() => alert("준비중입니다")}
                >
                  폼메일
                </button>
                <button
                  className="p-4 hover:bg-blue-100"
                  onClick={() => alert("준비중입니다")}
                >
                  고알바
                </button>
                <button
                  className="p-4 hover:bg-blue-100"
                  onClick={() => alert("준비중입니다")}
                >
                  알바선물
                </button>
              </div>
              <div className="flex justify-between w-full">
                <div className="flex flex-row justify-start gap-x-2 p-2">
                  <Link
                    to="/admin/ad/list"
                    className="hover:bg-warning py-2 px-4 rounded-full"
                  >
                    공고관리
                  </Link>
                  <Link
                    to="/admin/apply/list"
                    className="hover:bg-warning py-2 px-4 rounded-full"
                  >
                    회원 관리
                  </Link>
                </div>
                <div>
                  <button
                    className="hover:bg-warning py-2 px-4 rounded-full hover:text-red-500"
                    onClick={logout}
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
      ) : null}
    </>
  );
}

export default Header;
