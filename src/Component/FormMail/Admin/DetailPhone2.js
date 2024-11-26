import React, { useState } from "react";
import PhoneModal from "../SMS/PhoneModal";

function DetailPhone2(props) {
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <div
        className="flex flex-row justify-start gap-x-2"
        onClick={() => {
          setIsModal(!isModal);
        }}
      >
        <div
          className={`block p-1 min-w-[120px] text-sm font-neobold ${
            props.error
              ? "text-rose-500 dark:text-white"
              : "text-gray-900 dark:text-white"
          } hover:cursor-pointer`}
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

export default DetailPhone2;
