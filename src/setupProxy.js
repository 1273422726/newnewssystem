const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',     //请求头
    createProxyMiddleware({   //反向代理
      target: 'http://localhost:5000',      //请求地址
      changeOrigin: true,
    })
  );
};