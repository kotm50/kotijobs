import ky from "ky";
import { useDispatch } from "react-redux";
import { clearUser } from "../../Reducer/userSlice";
import { useLocation, useNavigate } from "react-router-dom";

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
  timeout: 10000, // 타임아웃 설정 (10초)
});

// 인스턴스 내보내기
export const useLogout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (location.pathname.includes("formmail")) {
        const res = await api.post("/api/v1/formMail_admin/logout").json();
        if (res.code === "C000" || res.code === "E403") {
          navigate("/formmail"); // 로그아웃 후 홈 화면으로 리디렉션
          dispatch(clearUser()); // Redux 상태 초기화
        }
      } else {
        const res = await api.post("/api/v1/jobsite/user/logout").json();
        if (res.code === "C000" || res.code === "E403") {
          navigate("/");
          dispatch(clearUser()); // Redux 상태 초기화
        }
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  return handleLogout;
};
