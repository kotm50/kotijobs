import { useState } from "react";
import ImgModal from "../ImgModal";

function UploadImg(props) {
  const [preview, setPreview] = useState(""); // 미리보기 이미지 경로
  const [isModal, setIsModal] = useState(false);

  const handleFileChange = event => {
    const selectedFile = event.target.files[0]; // 첫 번째 파일만 선택
    if (!selectedFile) {
      // 파일 선택이 취소된 경우
      props.setFile(null);
      setPreview(""); // 미리보기 이미지도 초기화
      return;
    }
    if (selectedFile) {
      // 파일 크기 체크 (10MB = 10 * 1024 * 1024 바이트)
      const fileSizeInMB = selectedFile.size / (1024 * 1024);
      if (fileSizeInMB > 10) {
        alert("용량이 너무 큽니다. 수정 후 다시 업로드 해 주세요.");
        props.setFile(null); // 파일 초기화

        event.target.value = ""; // input 값 초기화
        return;
      } else {
        const reader = new FileReader();

        // FileReader가 파일을 다 읽었을 때 실행될 함수
        reader.onloadend = () => {
          setPreview(reader.result); // 이미지를 미리보기 상태에 저장
        };

        reader.readAsDataURL(selectedFile); // 이미지를 읽어서 Data URL로 변환
      }
      // 파일이 10MB 이하일 경우 상태에 저장
      props.setFile(selectedFile);
    }
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 gap-y-2">
        <div className="flex justify-start gap-x-2">
          <div className="flex justify-between w-full">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="py-1.5"
            />
            <div className="py-1.5">
              <button
                type="button"
                className="px-2 py-0.5 bg-[#efefef] hover:bg-[#e5e5e5] rounded-sm border border-black"
                onClick={() => {
                  props.setFile(null);
                  setPreview(""); // 미리보기 이미지도 초기화
                }}
              >
                파일 초기화
              </button>
            </div>
          </div>
        </div>

        {/* 파일이 선택되면 미리보기 이미지 표시 */}
        {preview && (
          <>
            <div className="grid grid-cols-1 gap-y-2">
              <div
                className="w-fit h-fit relative z-0 hover:cursor-pointer"
                onClick={() => {
                  setIsModal(true);
                }}
                title="이미지를 클릭하면 원본 사이즈로 볼 수 있습니다"
              >
                <img
                  src={preview} // 미리보기 이미지 경로 사용
                  className="min-w-[60px] w-auto max-w-[100px] h-auto max-h-[150px]"
                  alt="미리보기"
                />
                <button
                  className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white w-[24px] h-[24px] text-center rounded-full z-10 group"
                  onClick={() => {
                    setIsModal(true);
                  }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[3px] h-[12px] z-[12] group-hover:bg-yellow-200" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-[12px] h-[3px] z-[12] group-hover:bg-yellow-200" />
                </button>
              </div>
              <span className="text-sm">
                썸네일을 클릭하면 원본크기로 볼 수 있습니다
              </span>
            </div>
          </>
        )}
      </div>
      {isModal && <ImgModal img={preview} setIsModal={setIsModal} />}
    </>
  );
}

export default UploadImg;
