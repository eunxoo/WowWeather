const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/api", {
      target:
        "https://port-0-wow-node-express-54ouz2lllulbggn.sel3.cloudtype.app/",
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware("/ctop", {
      target: "https://flask-ctop-6bc0d852fc9b.herokuapp.com/",
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware("/cbottom", {
      target: "https://flask-cbottom-8384193f62ea.herokuapp.com/",
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware("/gtop", {
      target: "https://flask-gtop-c1c46d539b34.herokuapp.com/",
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware("/gbottom", {
      target: "https://flask-gbottom-64b9ce8cfee2.herokuapp.com/",
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware("/ftop", {
      target: "https://flask-ftop-6ff568beb3eb.herokuapp.com/",
      changeOrigin: true,
    })
  );

  app.use(
    createProxyMiddleware("/fbottom", {
      target: "https://flask-fbottom-206e90740c99.herokuapp.com/",
      changeOrigin: true,
    })
  );
};
