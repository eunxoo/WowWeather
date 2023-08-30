const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target:
        "https://port-0-wow-node-express-54ouz2lllulbggn.sel3.cloudtype.app/",
      changeOrigin: true,
    })
  );
};
