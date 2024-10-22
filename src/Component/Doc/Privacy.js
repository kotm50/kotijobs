import React from "react";

function Privacy() {
  return (
    <>
      <h5 className="font-bold text-lg mb-4">수집하는 개인정보의 항목</h5>
      <p className="w-full">
        회사는 원활한 채용을 위해 개인정보를 수집하고 있습니다. <br /> -
        개인정보 수집방법 : 홈페이지(입사지원)
      </p>
      <h5 className="font-bold text-lg my-4">개인정보의 수집 및 이용목적</h5>
      <p className="w-full">
        회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
        <br />- 회사는 채용을 목적으로 귀하의 동의가 있는 경우, 적합한 기업을
        찾아서 알선해드리기 위해 위에 기재하신 내용을 활용하게 됩니다
        <br />
        귀하는 개인정보 수집이용에 대한 동의를 거부할 수 있으며, 동의를 거부한
        경우에는 귀하에게 그와 관련된 정보나 혜택은 제공드리지 않게 됩니다.
      </p>
      <h5 className="font-bold text-lg my-4">개인정보의 보유 및 이용기간</h5>
      <p className="w-full">
        회사는 민원처리 및 부정이용 방지를 위해 1년간 개인정보를 보관합니다
        <br />
        보관 기간이 경과된 개인정보는 지체없이 바로 파기합니다.
      </p>
    </>
  );
}

export default Privacy;
