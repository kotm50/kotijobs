import React, { useState } from "react";
import logo from "../../Asset/defaultlogo.png";

function ImgLoader(props) {
  const [imgSrc, setImgSrc] = useState(props.image);
  const handleError = () => {
    // 이미지 로드에 실패하면 기본 이미지로 변경
    setImgSrc(logo); // 기본 이미지 경로 설정
  };
  return (
    <img
      src={imgSrc}
      onError={handleError}
      className="max-w-full h-auto my-auto"
      alt={props.altText}
    />
  );
}

export default ImgLoader;
