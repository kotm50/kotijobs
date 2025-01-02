import { useState } from "react";
import ImgModal from "../ImgModal";

function DetailUploadImg(props) {
  const [isModal, setIsModal] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null); // 모달에서 보여줄 이미지
  const [adPosition, setAdPosition] = useState("up");

  const handleFileChange = event => {
    const files = Array.from(event.target.files);

    // 파일 개수 체크
    if (props.files.length + files.length > 10) {
      alert("최대 10개의 이미지만 업로드 가능합니다.");
      return;
    }

    const validFiles = [...props.files];
    const existingFileCount = validFiles.length; // 기존 파일 개수
    const promises = files.map((file, index) => {
      const fileSizeInMB = file.size / (1024 * 1024);

      if (fileSizeInMB > 10) {
        alert(
          `${file.name}은(는) 용량이 너무 큽니다. 10MB 이하로 수정 후 다시 업로드 해주세요.`
        );
        return null;
      }

      return new Promise(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            file: file,
            base64: reader.result,
            alt: `uploaded-${existingFileCount + index}`, // alt 속성에 기존 파일 개수를 기준으로 설정
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises)
      .then(results => {
        const newFiles = results.filter(file => file !== null); // 유효한 파일만 추가
        props.setFiles([...validFiles, ...newFiles]); // 한 번에 상태 업데이트
      })
      .catch(error => {
        console.error("파일 읽기 중 오류 발생:", error);
      });
  };

  const handleRemovePreview = (index, alt) => {
    const altAttribute = alt;
    console.log(altAttribute);

    // data 속성을 기준으로 <img> 태그를 찾는 정규식
    const imgTagRegex = new RegExp(
      `<img[^>]*alt=['"]${altAttribute}['"][^>]*>`,
      "g"
    );

    // detailContent에서 매칭되는 태그 제거
    const updatedContent = props.detailContent.replace(imgTagRegex, "");
    props.setDetailContent(updatedContent);

    // props.files에서 해당 파일 제거
    const updatedFiles = [...props.files];
    updatedFiles.splice(index, 1); // index를 기준으로 제거
    props.setFiles(updatedFiles);
  };

  const addImage = (url, alt) => {
    const imgTag = `<img src='${url}' alt='${alt}' />`;
    if (adPosition === "up") {
      // 앞에 추가
      props.setDetailContent(imgTag + props.detailContent);
    } else {
      // 뒤에 추가
      props.setDetailContent(props.detailContent + imgTag);
    }
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
            <div className="py-1.5 flex flex-row justify-start gap-x-10">
              <label
                htmlFor={`file-${props.type}`}
                className="custom-file-label px-2 py-0.5 bg-[#efefef] hover:bg-[#e5e5e5] rounded-sm border border-black cursor-pointer"
              >
                파일 선택
              </label>
              <div className="py-1 ">
                <span className="font-bold text-success">
                  {props.files.length}
                </span>{" "}
                / 10장
              </div>
              <div className="flex flex-row justify-center gap-x-10 gap-y-3 flex-wrap font-normal py-1">
                <div data="위로" className="flex items-center gap-x-2">
                  <input
                    id="ad-up"
                    type="radio"
                    name="ad-side"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                    checked={adPosition === "up"}
                    onChange={() => setAdPosition("up")}
                  />
                  <label htmlFor="ad-up" className="text-sm">
                    상세내용 위로
                  </label>
                </div>
                <div data="아래로" className="flex items-center gap-x-2">
                  <input
                    id="ad-down"
                    type="radio"
                    name="ad-side"
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                    checked={adPosition === "down"}
                    onChange={() => setAdPosition("down")}
                  />
                  <label htmlFor="ad-down" className="text-sm break-keep">
                    상세내용 아래로
                  </label>
                </div>
              </div>
            </div>
            <div className="py-1.5">
              <button
                type="button"
                className="px-2 py-0.5 bg-[#efefef] hover:bg-[#e5e5e5] rounded-sm border border-black"
                onClick={() => {
                  props.setFiles([]);
                }}
              >
                파일 초기화
              </button>
            </div>
          </div>
        </div>

        {/* 파일이 선택되면 미리보기 이미지 표시 */}
        {props.files.length > 0 && (
          <div className="grid grid-cols-1 gap-y-2">
            <div className="grid grid-cols-5 gap-x-4 gap-y-4">
              {props.files.map((fileData, index) => (
                <div
                  key={index}
                  className="relative p-1 border border-[#ccc] h-fit z-0 hover:cursor-pointer"
                >
                  <div
                    className="w-full h-full"
                    onClick={() => {
                      setSelectedImg(fileData.base64);
                      setIsModal(true);
                    }}
                  >
                    <img
                      src={fileData.base64} // 미리보기 이미지 경로 사용
                      className="min-w-[60px] w-auto max-w-[100px] h-auto max-h-[150px] mx-auto"
                      alt={`미리보기 ${index + 1}`}
                      title="이미지를 클릭하면 원본 사이즈로 볼 수 있습니다"
                    />
                  </div>
                  <div className="absolute top-0 right-0 w-full grid grid-cols-3">
                    {/* X 버튼 */}
                    <button
                      className="bg-green-600 text-white text-xs px-2 py-1 hover:bg-green-700 col-span-2 font-bold"
                      onClick={() => addImage(fileData.base64, fileData.alt)}
                    >
                      {adPosition === "up" ? "위로" : "아래로"} 추가하기
                    </button>
                    <button
                      className="bg-red-600 text-white text-xs px-2 py-1 hover:bg-red-700 font-bold"
                      onClick={() => handleRemovePreview(index, fileData.alt)}
                    >
                      삭제
                    </button>
                  </div>
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

export default DetailUploadImg;
