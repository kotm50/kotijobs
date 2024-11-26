import React, { useEffect, useState } from "react";
import { api } from "../../Api/Api";

function PhoneModal(props) {
  const [phoneList, setPhoneList] = useState([]);
  const [beforePhone, setBeforePhone] = useState("");
  useEffect(() => {
    getPhoneList();
  }, []);

  useEffect(() => {
    setBeforePhone(props.phone);
    //eslint-disable-next-line
  }, []);

  const getPhoneList = async () => {
    setPhoneList([]);
    const res = await api.get("/api/v1/formMail_admin/allPhoneNumList").json();
    setPhoneList(res.phoneNumList || []);
  };

  return (
    <>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 border rounded-lg p-4 w-fit h-fit z-20">
        <h3 className="text-center font-neoextra text-base">
          업무용 연락처 리스트(SMS발송용){" "}
          <span className="text-sm">
            (ctrl+f 누르고 번호 입력하면 검색 가능)
          </span>
        </h3>
        <div className="h-auto  max-h-[800px] overflow-auto relative">
          <table className="max-w-full w-[600px]">
            <thead>
              <tr className="sticky top-0">
                <th className="p-1 bg-blue-500 text-white border border-white border-y-blue-500">
                  번호
                </th>
                <th className="p-1 bg-blue-500 text-white border border-white border-y-blue-500">
                  입력
                </th>
              </tr>
            </thead>
            <tbody>
              {phoneList.map((num, idx) => (
                <tr key={idx}>
                  <td className="p-2 border bg-white">{num.phoneNumber}</td>
                  <td className="border bg-white p-1">
                    <button
                      className="bg-green-500 hover:bg-green-600 text-white w-full p-1"
                      onClick={() => {
                        props.setPhone(num.phoneNumber);
                        props.setIsModal(false);
                      }}
                    >
                      번호입력
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div
        className="fixed top-0 left-0 w-screen h-screen overflow-hidden bg-black bg-opacity-30 z-10"
        onClick={() => {
          props.setPhone(beforePhone);
          props.setIsModal(false);
        }}
      />
    </>
  );
}

export default PhoneModal;
