import React, { useEffect, useState } from "react";
import PhoneModal from "./PhoneModal";

function ManagePhone(props) {
  const [isModal, setIsModal] = useState(false);
  useEffect(() => {
    console.log(isModal);
  }, [isModal]);
  return (
    <>
      <div
        className="mb-3"
        onClick={() => {
          setIsModal(!isModal);
        }}
      >
        <div
          className={`block mb-2 text-sm font-neobold ${
            props.error
              ? "text-rose-500 dark:text-white"
              : "text-gray-900 dark:text-white"
          }`}
        >
          {props.title}
        </div>
        <div
          id={props.id}
          className={`shadow-sm border bg-gray-50 ${
            props.error ? "border-rose-500" : "border-gray-300"
          } ${
            props.phone ? "text-gray-900" : "text-gray-400"
          }  text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light hover:cursor-pointer`}
        >
          {props.phone ? props.phone : "여길 눌러 업무용 번호를 입력하세요"}
        </div>
      </div>
      {isModal && (
        <PhoneModal
          setIsModal={setIsModal}
          phone={props.phone}
          setPhone={props.setPhone}
        />
      )}
    </>
  );
}

export default ManagePhone;
