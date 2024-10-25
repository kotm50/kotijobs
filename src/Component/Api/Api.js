import ky from "ky";
import { useDispatch } from "react-redux";
import { clearUser } from "../../Reducer/userSlice";

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

const portNum = window.location.port;
export const baseUrl = portNum === "3014" ? process.env.REACT_APP_IMG_URL : "";

// ky API 인스턴스 생성
export const api = ky.create({
  credentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          // 로그아웃 처리 (Redux 상태 초기화 등)
          useDispatch(clearUser());
          window.location.href = "/"; // 로그인 페이지로 이동
        }
      },
    ],
  },
  timeout: 10000, // 타임아웃 설정 (10초)
});

// 인스턴스 내보내기
