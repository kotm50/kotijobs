function ReLogin(props) {
  return (
    <>
      <div className="flex flex-col justify-center gap-y-10 min-h-fit max-w-[360px] text-center">
        <h4 className="text-primary font-extra text-lg lg:text-xl">
          로그인 연장 필요
        </h4>
        <div className="flex flex-col justify-start gap-x-2 text-sm">
          <div>장기간 활동이 감지되지 않아</div>
          <div>
            <span className="text-success font-extra text-lg">
              {props.limit}
            </span>
            초 후 로그아웃 됩니다
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-2 text-sm h-fit">
          <button
            className="w-full bg-primary hover:bg-opacity-80 text-white col-span-2 p-2 rounded-lg"
            onClick={() => props.extendLogin()}
          >
            로그인 연장하기
          </button>
          <button
            className="w-full border border-gray-300 hover:bg-gray-100 p-2 rounded-lg"
            onClick={() => {
              props.setLimit(0);
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
}

export default ReLogin;
