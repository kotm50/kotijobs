import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { api } from "../../Api/Api";

function AdList() {
  const thisLocation = useLocation();
  useEffect(() => {
    getAdList();
  }, [thisLocation]);

  const getAdList = async () => {
    const data = {
      page: 1,
      size: 20,
    };
    const res = await api
      .post("/api/v1/formMail_ad/allJobsiteList", { json: data })
      .json();
    console.log(res);
  };
  return (
    <>
      <div className="w-full max-w-[1200px] mx-auto mt-[100px] bg-white py-10 grid grid-cols-1 gap-y-[100px] mb-20">
        리스트
      </div>
    </>
  );
}

export default AdList;
