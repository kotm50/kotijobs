const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      //target: "http://192.168.0.35:8080", //로컬 프록시 (안쓰면 //로 주석처리)
      target: "http://3.34.81.182:8080/", //AWS 프록시 (안쓰면 //로 주석처리)
      changeOrigin: true,
      logLevel: "debug", // 로그를 확인하기 위한 설정
    })
  );
};
