import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Menu() {
  const navi = useNavigate();
  return (
    <div className="w-[210px] border-r h-screen bg-white overflow-auto fixed top-0 left-0 hidden lg:block z-1">
      <h2
        className="p-2 hover:cursor-pointer text-lg font-neoextra text-center bg-blue-500 text-white"
        onClick={() => navi("/formmail/main")}
      >
        코리아<span className="text-[#ff0] font-neoheavy">티엠</span> 전산시스템
      </h2>
      <div className="flex flex-col justify-start text-left divide-y">
        <h3 className="font-neoextra p-2 bg-white text-sm">게시판</h3>
        <Link
          to="/formmail/main"
          className="block bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm"
        >
          공지사항
        </Link>
      </div>
      <div className="flex flex-col justify-start text-left divide-y">
        <h3 className="font-neoextra p-2 bg-white text-sm">지원자리스트</h3>
        <Link
          to="/formmail/apply/list"
          className="block bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm"
        >
          전체 지원자
        </Link>
        <Link
          to="/formmail/main"
          className="block bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm"
        >
          내부채용
        </Link>
        <Link
          to="/formmail/main"
          className="block bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm"
        >
          운영 실장
        </Link>
      </div>
      <div className="flex flex-col justify-start text-left divide-y">
        <h3 className="font-neoextra p-2 bg-white text-sm">직접입력</h3>
        <Link
          to="/formmail/apply/add"
          className="block bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm"
        >
          지원자 입력
        </Link>
        <Link
          to="/formmail/company/add"
          className="block bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm"
        >
          고객사 입력
        </Link>
      </div>
      <div className="flex flex-col justify-start text-left divide-y">
        <h3 className="font-neoextra p-2 bg-white text-sm">고객사</h3>
        <Link
          to="/formmail/company/list"
          className="block bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm"
        >
          고객사 리스트
        </Link>
        <Link
          to="/formmail/ad/add"
          className="block bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm"
        >
          광고 등록
        </Link>
        <Link
          to="/formmail/main"
          className="block bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm"
        >
          광고 목록
        </Link>
      </div>
      <div className="flex flex-col justify-start text-left divide-y">
        <h3 className="font-neoextra p-2 bg-white text-sm">관리자</h3>
        <Link
          to="/formmail/admin/list"
          className="block bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm"
        >
          관리자 리스트
        </Link>
        <Link
          to="/formmail/admin/add"
          className="block bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm"
        >
          관리자 추가
        </Link>
        <Link
          to="/formmail/admin/adminphone"
          className="block bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm"
        >
          업무폰 관리
        </Link>
        <Link
          to="/formmail/survey"
          className="hidden bg-slate-100 hover:bg-slate-200 px-2 py-1 text-sm"
        >
          설문지 관리
        </Link>
      </div>
    </div>
  );
}

export default Menu;
