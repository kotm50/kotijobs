import { useState } from "react";
import ImgModal from "../ImgModal";

function MultipleUploadImg(props) {
  const [previews, setPreviews] = useState([]); // 미리보기 이미지 경로 배열
  const [isModal, setIsModal] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null); // 모달에서 보여줄 이미지

  const handleFileChange = event => {
    const files = Array.from(event.target.files);

    // 파일 개수 체크 (최대 10개)
    if (previews.length + files.length > 10) {
      alert("최대 10개의 이미지만 업로드 가능합니다.");
      return;
    }

    const previewsTemp = [...previews];
    const validFiles = [...props.files];

    files.forEach(file => {
      const fileSizeInMB = file.size / (1024 * 1024);

      // 파일 크기 체크 (10MB 제한)
      if (fileSizeInMB > 10) {
        alert(
          `${file.name}은(는) 용량이 너무 큽니다. 10MB 이하로 수정 후 다시 업로드 해주세요.`
        );
      } else {
        const reader = new FileReader();

        // FileReader가 파일을 다 읽었을 때 실행될 함수
        reader.onloadend = () => {
          previewsTemp.push(reader.result); // 미리보기 이미지 추가
          setPreviews([...previewsTemp]); // 상태 업데이트
        };

        reader.readAsDataURL(file); // 이미지를 읽어서 Data URL로 변환
        validFiles.push(file);
      }
    });

    // 유효한 파일만 상태에 추가
    props.setFiles(validFiles);
  };

  const handleRemovePreview = index => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);

    const updatedFiles = props.files.filter((_, i) => i !== index);
    props.setFiles(updatedFiles);
  };

  return (
    <>
      <div className="w-full grid grid-cols-1 gap-y-2">
        <div className="flex justify-start gap-x-2">
          <div className="flex justify-between w-full">
            <input
              type="file"
              id={`file-${props.type}`}
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="hidden-file-input"
            />
            <div className="py-1.5 flex flex-row  justify-start gap-x-1">
              <label
                htmlFor={`file-${props.type}`}
                className="custom-file-label px-2 py-0.5 bg-[#efefef] hover:bg-[#e5e5e5] rounded-sm border border-black cursor-pointer"
              >
                파일 선택
              </label>
              {previews.length > 0 ? (
                <div className="py-0.5">
                  파일{" "}
                  <span className="font-bold text-success">
                    {previews.length}
                  </span>{" "}
                  개,{" "}
                  {10 - previews.length > 0
                    ? `${10 - previews.length}개 추가 가능 합니다`
                    : null}
                </div>
              ) : (
                <div className="py-0.5">최대 10개까지 업로드 가능합니다.</div>
              )}
            </div>
            <div className="py-1.5">
              <button
                type="button"
                className="px-2 py-0.5 bg-[#efefef] hover:bg-[#e5e5e5] rounded-sm border border-black"
                onClick={() => {
                  props.setFiles([]);
                  setPreviews([]); // 미리보기 이미지 초기화
                }}
              >
                파일 초기화
              </button>
            </div>
          </div>
        </div>

        {/* 파일이 선택되면 미리보기 이미지 표시 */}
        {previews.length > 0 && (
          <div className="grid grid-cols-1 gap-y-2">
            <div className="grid grid-cols-5 gap-x-4 gap-y-4">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="relative p-1 border border-[#ccc] h-fit z-0 hover:cursor-pointer"
                >
                  <div
                    className="w-full h-full"
                    onClick={() => {
                      setSelectedImg(preview);
                      setIsModal(true);
                    }}
                  >
                    <img
                      src={preview} // 미리보기 이미지 경로 사용
                      className="min-w-[60px] w-auto max-w-[100px] h-auto max-h-[150px] mx-auto"
                      alt={`미리보기 ${index + 1}`}
                      title="이미지를 클릭하면 원본 사이즈로 볼 수 있습니다"
                    />
                  </div>
                  {/* X 버튼 */}
                  <button
                    className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 hover:bg-red-600"
                    onClick={() => handleRemovePreview(index)}
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
            <span className="text-sm">
              썸네일을 클릭하면 원본크기로 볼 수 있습니다
            </span>
          </div>
        )}
      </div>

      {/* 선택한 이미지를 모달로 표시 */}
      {isModal && selectedImg && (
        <ImgModal img={selectedImg} setIsModal={setIsModal} />
      )}
    </>
  );
}

export default MultipleUploadImg;
