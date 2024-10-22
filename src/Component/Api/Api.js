import ky from "ky";

export const uploadFile = async file => {
  const formData = new FormData();

  if (file) {
    formData.append("file", file); // 'file'은 서버에서 기대하는 필드 이름
  } else {
    alert("업로드할 파일이 없습니다.");
    return;
  }

  try {
    const res = await ky
      .post("/api/v1/formMail_common/S3Upload", {
        body: formData, // FormData 객체를 body로 전달
      })
      .json();
    console.log("File uploaded successfully:", res);
    return res.url;
  } catch (error) {
    console.error("File upload failed:", error);
  }
};

export const baseUrl = process.env.REACT_APP_IMG_URL || "";
console.log(baseUrl);

// ky API 인스턴스 생성
export const api = ky.create({
  //prefixUrl: process.env.REACT_APP_API_URL, // 환경 변수 사용
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 타임아웃 설정 (10초)
});

// 인스턴스 내보내기
