import React, { useEffect, useState } from "react";
import { api } from "../../Api/Api";
import ManagePhone from "./ManagePhone";
import InputPhone from "../Admin/InputPhone";

function Sms(props) {
  const [rPhone, setRPhone] = useState("010-8031-5450");
  const [phone, setPhone] = useState("010-7745-6059");
  const [sPhone1, setSPhone1] = useState("010");
  const [sPhone2, setSPhone2] = useState("7745");
  const [sPhone3, setSPhone3] = useState("6059");
  const [msg, setMsg] = useState("");
  const [smsType, setSmsType] = useState("S");
  const [byteSize, setByteSize] = useState(0);
  const [error, setError] = useState("");
  const [forcedLMS, setForcedLMS] = useState("");

  useEffect(() => {
    if (phone && phone.length === 13) {
      const sPhone = phone.split("-");
      console.log(sPhone);

      setSPhone1(sPhone[0]);
      setSPhone2(sPhone[1]);
      setSPhone3(sPhone[2]);
    }
  }, [phone]);

  useEffect(() => {
    if (byteSize > 80) {
      setSmsType("L");
      setForcedLMS(true);
    } else {
      setForcedLMS(false);
      setSmsType("S");
    }
    //eslint-disable-next-line
  }, [byteSize]);

  // 텍스트 Byte 크기를 계산하는 함수
  const calculateByteSize = text => {
    let totalBytes = 0;
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      if (charCode >= 0x00 && charCode <= 0x7f) {
        // 영문 및 숫자는 1Byte
        totalBytes += 1;
      } else {
        // 한글 및 기타 문자는 2Byte
        totalBytes += 2;
      }
    }
    return totalBytes;
  };

  const handleSmsTypeChange = e => {
    setSmsType(e.target.value); // 선택한 라디오 버튼의 값을 업데이트
  };

  const handleByteChange = e => {
    const text = e.target.value;
    setMsg(text);
    setByteSize(calculateByteSize(text)); // Byte 계산 후 상태 업데이트
  };

  const sendIt = async () => {
    if (rPhone.length !== 13) {
      return alert("수신번호가 잘못되었습니다 확인 후 다시 눌러주세요");
    }
    const data = {
      msg: msg,
      smsType: smsType,
      sPhone1: sPhone1,
      sPhone2: sPhone2,
      sPhone3: sPhone3,
      rPhone: rPhone,
    };
    console.log(data);
    try {
      const res = await api
        .post("/api/v1/formMail/sendSms", {
          json: data,
        })
        .json();
      alert(res.message);
    } catch (e) {
      // 오류 메시지와 상태 코드를 함께 출력
      if (e.response) {
        console.error(`Error: ${e.message}, Status: ${e.response.status}`);
      } else {
        console.error(`Error: ${e.message}`);
      }
    }
  };
  return (
    <>
      <div className="p-2 bg-white border rounded-lg">
        <div className="mb-3">
          <div className="flex">
            <div className="flex items-center me-4">
              <input
                checked={smsType === "S"}
                id="inline-radio"
                type="radio"
                value="S"
                onChange={handleSmsTypeChange}
                name="inline-radio-group"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="inline-radio"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                단문(한글 40자)
              </label>
            </div>
            <div className="flex items-center me-4">
              <input
                checked={smsType === "L"}
                id="inline-2-radio"
                type="radio"
                value="L"
                onChange={handleSmsTypeChange}
                name="inline-radio-group"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="inline-2-radio"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                장문(한글 1000자)
              </label>
            </div>
            {forcedLMS && (
              <div className="text-rose-500">
                글 수가 너무 많아 장문으로 전환됩니다
              </div>
            )}
          </div>
        </div>
        <ManagePhone
          title={"문자 보낼 연락처"}
          id={"phone"}
          phone={phone}
          setPhone={setPhone}
        />
        <InputPhone
          title={"문자 받을 연락처"}
          id={"rPhone"}
          phone={rPhone}
          setPhone={setRPhone}
          error={error}
          setError={setError}
        />
        <div className="mb-3">
          <label
            htmlFor="message"
            className="block mb-2 text-sm font-neobold text-gray-900 dark:text-white"
          >
            문자 내용 입력 ({byteSize} / {smsType === "S" ? "80" : "2000"} Byte)
          </label>
          <textarea
            id="message"
            rows="4"
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full  p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light"
            value={msg}
            onChange={handleByteChange}
            onBlur={e => setMsg(e.currentTarget.value)}
          />
        </div>
        <div className="flex justify-start gap-x-2">
          <button
            className="p-2 bg-green-600 text-white"
            onClick={() => {
              sendIt();
            }}
          >
            문자전송
          </button>
          <span className="p-2 font-neobold">
            발신 : <span className="font-neoextra text-green-600">{phone}</span>{" "}
            / 수신 :{" "}
            <span className="font-neoextra text-blue-600">
              {rPhone.length === 13 ? rPhone : "입력 중..."}
            </span>
          </span>
        </div>
      </div>
    </>
  );
}

export default Sms;
