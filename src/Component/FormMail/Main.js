import React from "react";
import Menu from "./Layout/Menu";

function Main() {
  return (
    <>
      <Menu />
      <div className="bg-[#fafbfc] lg:ml-[220px]">
        <div className="flex flex-col justify-start gap-y-4 p-4 bg-white border w-[600px]">
          <div>
            현재 개발 중 입니다. 메뉴에서 확인 가능한 페이지는 아래와 같습니다
          </div>
          <div>
            <span className="font-bold">관리자 리스트(개발 완료)</span> : 관리자
            목록(상세 정보 확인 및 수정 가능)
          </div>
          <div>
            <span className="font-bold">관리자 추가(개발 완료)</span> : 관리자
            계정 등록
          </div>
          <div>
            <span className="font-bold">업무폰 관리(개발 완료)</span> : 문자발송
            api 사용 가능한 업무폰 번호 목록
          </div>
          <div>
            <span className="font-bold">고객사 입력(개발 중)</span> : 고객사
            정보입력 (입력 내용 추가중)
          </div>
          <div>
            <span className="font-bold">고객사 리스트(개발 중)</span> : 고객사
            리스트 화면 (상세정보 및 수정 기능 개발 중)
          </div>
          <div>
            이미지 업로드 기능, 문자발송 기능은 개발이 완료되었으나 페이지
            준비중 입니다.
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
