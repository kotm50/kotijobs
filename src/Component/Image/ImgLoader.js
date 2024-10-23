import React, { useRef, useState } from "react";
import logo from "../../Asset/defaultlogo.png";

function ImgLoader(props) {
  const imgRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(props.image);
  const handleError = () => {
    console.log(imgSrc);
    // 이미지 로드에 실패하면 기본 이미지로 변경
    setImgSrc(logo); // 기본 이미지 경로 설정
  };
  const handleHeight = () => {
    if (imgRef.current) {
      if (props.isAd) {
        props.setHeight(`${imgRef.current.naturalHeight}px`);
      }
    }
  };
  return (
    <img
      ref={imgRef}
      src={imgSrc}
      onError={handleError}
      onLoad={handleHeight}
      className={props.tag}
      alt={props.altText}
    />
  );
}

export default ImgLoader;
