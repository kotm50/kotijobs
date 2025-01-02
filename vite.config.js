import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 네트워크 노출 활성화
    port: 5173, // 기본 포트 (필요 시 변경 가능)
    proxy: {
      "/api": {
        //target: "http://192.168.0.35:8080", // 로컬 프록시
        target: "https://cafecon.co.kr/", // AWS 프록시
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ""), // API 경로 재작성 (필요한 경우)
      },
      "/images": {
        target: "https://goalba.co.kr", // 로컬 프록시
        //target: "https://cafecon.co.kr/", // AWS 프록시
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ""), // API 경로 재작성 (필요한 경우)
      },
    },
  },
});
