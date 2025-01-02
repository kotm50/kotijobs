import DaumPostcode from "react-daum-postcode";

const PopupPostCode = props => {
  // 우편번호 검색 후 주소 클릭 시 실행될 함수, data callback 용
  const handlePostCode = data => {
    console.log(data);
    props.setAreaA({
      sido: data.sido,
      sigungu: data.sigungu,
      dongEubMyun: "전체",
    });
    props.setZipCode(data.zonecode);
    props.setAddressA(data.roadAddress);
    props.setFullAddress(data.jibunAddress);
    props.onClose();
  };

  return (
    <>
      <div
        id="addrAPI"
        className="fixed top-0 botton-0 w-full h-full lg:w-[600px] lg:h-fit lg:min-h-[480px] bg-white border drop-shadow-md rounded lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-[1001]"
      >
        <DaumPostcode className="addrAPIInput" onComplete={handlePostCode} />
        <button
          type="button"
          onClick={() => {
            props.onClose();
          }}
          className="postCode_btn bg-rose-500 text-white py-2 w-full mt-1"
        >
          닫기
        </button>
      </div>
      <div className="opacity-25 fixed inset-0 z-[1000] bg-black h-screen overflow-hidden"></div>
    </>
  );
};

export default PopupPostCode;
