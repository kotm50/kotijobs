import { useNavigate } from "react-router-dom";
import prepare from "../../assets/prepare.svg";

function RouteErr() {
  const navi = useNavigate();
  return (
    <button
      onClick={() => navi(-1)}
      className="w-fit h-fit fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center gap-y-4 text-2xl"
    >
      <p className="w-full text-center font-bold">Page is being prepared</p>
      <p className="w-full text-center">현재 개발중인 페이지 입니다</p>
      <div className="w-fit">
        <img src={prepare} className="h-[300px]" alt="" />
      </div>
      <div className="w-full p-2 font-bold">
        여길 눌러 <span className="text-blue-500 font-bold">이전 페이지</span>{" "}
        로 이동하세요
      </div>
    </button>
  );
}

export default RouteErr;
