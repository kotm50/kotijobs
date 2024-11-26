import React from "react";

function DetailPhone(props) {
  // 입력 값 변경 시 호출
  const handleChange = e => {
    const value = e.target.value;
    // 숫자와 하이픈만 남기기
    const filteredValue = value.replace(/[^0-9-]/g, "");
    props.setPhone(filteredValue);
    props.setError(""); // 입력 중에는 에러 메시지 초기화
  };

  // 입력 창이 focus 상태가 될 때 호출
  const handleFocus = () => {
    // 하이픈 제거하고 숫자만 남기기
    const plainNumber = props.phone.replace(/-/g, "");
    props.setPhone(plainNumber);
  };

  // 입력 창이 blur 상태가 될 때 호출
  const handleBlur = () => {
    if (props.phone) {
      // '010-0000-0000' 형식인 경우
      const validPhoneFormat = /^010-\d{4}-\d{4}$/;
      // '01000000000' 형식인 경우
      const plainPhoneFormat = /^010\d{8}$/;

      if (validPhoneFormat.test(props.phone)) {
        // 유효한 형식일 경우 아무 반응 없음
        props.setError("");
      } else if (plainPhoneFormat.test(props.phone)) {
        // 하이픈 없는 11자리 숫자인 경우, 하이픈 추가
        const formattedNumber = props.phone.replace(
          /(\d{3})(\d{4})(\d{4})/,
          "$1-$2-$3"
        );
        props.setPhone(formattedNumber);
        props.setError("");
      } else {
        // 그 외의 경우, 경고 메시지 표시
        props.setError("양식에 맞지 않습니다.");
      }
    }
  };

  return (
    <div className="flex flex-row justify-start gap-x-2">
      <label
        htmlFor={props.id}
        className={`block p-1 min-w-[120px] text-sm font-neobold ${
          props.error
            ? "text-rose-500 dark:text-white"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {props.title}
      </label>
      <input
        type="text"
        id={props.id}
        className={`shadow-sm border bg-gray-50 ${
          props.error ? "border-rose-500" : "border-gray-300"
        } text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500 dark:shadow-sm-light`}
        value={props.phone}
        onFocus={handleFocus}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="하이픈(-) 없이 숫자만 입력해주세요 01045451212"
        required={props.required}
      />

      {props.error && (
        <div className="text-rose-500 text-sm mt-1 mb-4">{props.error}</div>
      )}
    </div>
  );
}

export default DetailPhone;
