import React from "react";
import DaumPostcode from "react-daum-postcode";

const PopupPostCode = props => {
  // 우편번호 검색 후 주소 클릭 시 실행될 함수, data callback 용
  const handlePostCode = data => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    console.log(fullAddress);
    props.setAddress(fullAddress);
    if (!props.isAd) {
      props.setInputAddress(true);
    } else {
      props.setAddrDetail(true);
      props.setAddr("");
    }
    props.onClose();
  };

  return (
    <>
      <div
        id="addrAPI"
        className="fixed top-0 botton-0 w-full h-full bg-white border drop-shadow-md rounded z-50 lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2"
      >
        <DaumPostcode className="addrAPIInput" onComplete={handlePostCode} />
        <button
          type="button"
          onClick={() => {
            props.onClose();
          }}
          className="postCode_btn bg-rose-500 text-white py-2 w-full"
        >
          닫기
        </button>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black h-screen overflow-hidden"></div>
    </>
  );
};

export default PopupPostCode;
