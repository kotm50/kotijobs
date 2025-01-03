import { useEffect, useState } from "react";
import { grades } from "../../Data/Data";
import { api } from "../../Api/Api";
function GradeEdit(props) {
  const [adInfo, setAdInfo] = useState(null);
  const [grade, setGrade] = useState(null);
  const [focus, setFocus] = useState(false);
  useEffect(() => {
    setAdInfo(props.selectedAd);
    setGrade(props.selectedAd.grade);
    setFocus(props.selectedAd.focus);
  }, [props.selectedAd]);

  const handleFocusChange = event => {
    setFocus(event.target.checked); // 체크박스 상태 업데이트
  };

  const submit = async () => {
    const data = {
      aid: adInfo.aid,
      grade: grade,
      focus: focus,
    };

    const res = await api
      .put("/api/v1/formMail_ad/update/grade", { json: data })
      .json();
    console.log(res);
    if (res.code === "C000") {
      props.setModalType("");
      props.setModalOn(false);
      props.getAdList();
    }
  };
  return (
    <div className="p-4 grid grid-cols-1 gap-y-5 w-[500px] max-w-full">
      {adInfo && grade !== null && (
        <>
          <div className="border flex flex-row w-full">
            <div className="bg-blue-100 p-2 font-bold w-[30%]">공고제목</div>
            <div
              className="text-center p-2 w-[70%] whitespace-nowrap text-ellipsis overflow-x-hidden"
              title={adInfo.title}
            >
              {adInfo.title}
            </div>
          </div>
          <h4 className="text-lg font-bold text-primary pt-4">유료상품 1</h4>
          <div className="grid grid-cols-1 gap-y-0 border-t">
            {[...grades]
              .reverse() // 배열 순서를 반대로 변경
              .map((gra, idx) => (
                <div
                  data={`업직종${idx + 1}`}
                  className="flex items-center gap-x-2 border-b py-4 px-2"
                  key={idx}
                >
                  <input
                    id={`grade-${idx + 1}`}
                    type="radio"
                    value={gra.value}
                    name={`grade-${idx + 1}`}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 text-lg"
                    checked={gra.value === grade}
                    onChange={e => setGrade(Number(e.currentTarget.value))}
                  />
                  <label htmlFor={`grade-${idx + 1}`} className="text-lg">
                    {gra.txt === "전체" ? "사용 안함" : gra.txt}
                    {gra.des ? ` : ${gra.des}` : ""}
                  </label>
                </div>
              ))}
          </div>

          <h4 className="text-lg font-bold text-primary pt-4">유료상품 2</h4>
          <div className="grid grid-cols-1 gap-y-0 border-t">
            <div
              data="포커스광고"
              className="flex items-center gap-x-2 border-b py-4 px-2"
            >
              <input
                id="focus"
                type="checkbox"
                name="focus"
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2 text-lg"
                checked={focus}
                onChange={handleFocusChange}
              />
              <label htmlFor="focus" className="text-lg">
                포커스 광고 : 메인 중단, 검색결과 노출
              </label>
            </div>
          </div>
          <div className="flex justify-center gap-x-4 pt-4">
            <button
              className="py-2 px-10 w-fit bg-primary hover:bg-opacity-80 text-white text-lg rounded-lg"
              onClick={() => submit()}
            >
              적용하기
            </button>
            <button
              className="py-2 px-10 w-fit bg-white hover:bg-gray-100 text-stone-600 text-lg border rounded-lg"
              onClick={() => {
                props.setModalType("");
                props.setModalOn(false);
              }}
            >
              취소하기
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default GradeEdit;
