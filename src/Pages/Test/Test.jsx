import { useState } from "react";
import UploadImg from "../../Components/UploadImg";
import { deleteFile, uploadFile } from "../../Api/Api";

function Test() {
  const [mon, setMon] = useState(null);
  const [monTxt, setMonTxt] = useState("");
  const [hvn, setHvn] = useState(null);
  const [hvnTxt, setHvnTxt] = useState("");
  const [logoImg, setLogoImg] = useState(""); // 로고 url
  const [logoUrl, setLogoUrl] = useState(""); // 로고 url

  const parseMon = e => {
    const result = {};

    const inputText = e.target.value;
    // 정규식을 사용하여 데이터를 추출
    const nameMatch = inputText.match(/^([\w가-힣]+)/m);
    const genderAndAgeMatch = inputText.match(
      /(남자|여자)\s+(\d{2})세(\d{4})년생/
    );
    const contactMatch = inputText.match(/휴대폰\s+(\d{3}-\d{4}-\d{4})/);
    const addressMatch = inputText.match(/주소\s+(.+)/);

    if (nameMatch) {
      result.name = nameMatch[1];
    }

    if (genderAndAgeMatch) {
      result.gender = genderAndAgeMatch[1];
      result.age = genderAndAgeMatch[3]; // 년생에서 날짜를 0000으로 설정
    }

    if (contactMatch) {
      result.contact = contactMatch[1];
    }

    if (addressMatch) {
      result.address = addressMatch[1].trim();
    }

    console.log(result);
    setMon(result);
  };

  const parseHvn = e => {
    const result = {};

    const inputText = e.target.value;
    // 정규식을 사용하여 데이터를 추출
    const nameMatch = inputText.match(/([\w가-힣]+) (남자|여자)/);
    const ageMatch = inputText.match(/(\d{4})년생/);
    const contactMatch = inputText.match(/연락처 (\d{3}-\d{4}-\d{4})/);
    const addressMatch = inputText.match(/주소 (.+)$/m);

    if (nameMatch) {
      result.name = nameMatch[1];
      result.gender = nameMatch[2];
    }

    if (ageMatch) {
      result.age = ageMatch[1]; // 년생에서 날짜를 0000으로 설정
    }

    if (contactMatch) {
      result.contact = contactMatch[1];
    }

    if (addressMatch) {
      result.address = addressMatch[1].trim();
    }

    console.log(result);
    setHvn(result);
  };
  const uploadTest = async () => {
    const url = await uploadFile(logoImg, "logo");
    setLogoUrl(url);
  };

  const deleteTest = async () => {
    const res = await deleteFile(logoUrl);
    if (res === "C000") {
      setLogoUrl("");
    }
  };
  return (
    <>
      <div className="mt-[200px] bg-white w-full grid-cols-2 gap-x-2 max-w-[1200px] mx-auto p-2 hidden">
        <div className="grid grid-cols-1 gap-y-4">
          <div className="p-2">
            <textarea
              className="w-full h-[100px] border"
              value={monTxt}
              onChange={e => setMonTxt(e.currentTarget.value)}
              onBlur={parseMon}
            ></textarea>
          </div>
          <button
            className="w-[50%] mx-auto p-2 bg-red-500 text-white"
            onClick={() => {
              setMon(null);
              setMonTxt("");
            }}
          >
            초기화
          </button>
          {mon && (
            <div className="grid grid-cols-1 gap-y-2 p-2">
              <div className="flex justify-start gap-x-2">
                <div className="font-bold">이름</div>
                <div>{mon.name}</div>
              </div>
              <div className="flex justify-start gap-x-2">
                <div className="font-bold">성별</div>
                <div>{mon.gender}</div>
              </div>
              <div className="flex justify-start gap-x-2">
                <div className="font-bold">나이</div>
                <div>{mon.age}</div>
              </div>
              <div className="flex justify-start gap-x-2">
                <div className="font-bold">주소</div>
                <div>{mon.address}</div>
              </div>
              <div className="flex justify-start gap-x-2">
                <div className="font-bold">연락처</div>
                <div>{mon.contact}</div>
              </div>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-y-4">
          <div className="p-2">
            <textarea
              className="w-full h-[100px] border"
              value={hvnTxt}
              onChange={e => setHvnTxt(e.currentTarget.value)}
              onBlur={parseHvn}
            ></textarea>
          </div>
          <button
            className="w-[50%] mx-auto p-2 bg-red-500 text-white"
            onClick={() => {
              setHvn(null);
              setHvnTxt("");
            }}
          >
            초기화
          </button>
          {hvn && (
            <div className="grid grid-cols-1 gap-y-2 p-2">
              <div className="flex justify-start gap-x-2">
                <div className="font-bold">이름</div>
                <div>{hvn.name}</div>
              </div>
              <div className="flex justify-start gap-x-2">
                <div className="font-bold">성별</div>
                <div>{hvn.gender}</div>
              </div>
              <div className="flex justify-start gap-x-2">
                <div className="font-bold">나이</div>
                <div>{hvn.age}</div>
              </div>
              <div className="flex justify-start gap-x-2">
                <div className="font-bold">주소</div>
                <div>{hvn.address}</div>
              </div>
              <div className="flex justify-start gap-x-2">
                <div className="font-bold">연락처</div>
                <div>{hvn.contact}</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-[200px] bg-white w-full grid grid-cols-1 gap-x-2 gap-y-4 max-w-[1200px] mx-auto p-2 ">
        <UploadImg
          title={"로고이미지"}
          type={"logo"}
          file={logoImg}
          setFile={setLogoImg}
        />

        <button
          className="w-[50%] mx-auto p-2 bg-red-500 text-white"
          onClick={() => {
            uploadTest();
          }}
        >
          업로드 테스트
        </button>

        <button
          className="w-[50%] mx-auto p-2 bg-green-500 text-white"
          onClick={() => {
            deleteTest();
          }}
        >
          삭제 테스트
        </button>
        {logoUrl && <img src={logoUrl} alt="test" className="max-w-[200px]" />}
      </div>
    </>
  );
}

export default Test;
