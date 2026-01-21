const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  const target = "http://localhost:8800";

  app.use(
    "/posts",
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { "^/posts": "/api/posts" },
    })
  );

  app.use(
    "/auth",
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { "^/auth": "/api/auth" },
    })
  );

  app.use(
    "/users",
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { "^/users": "/api/users" },
    })
  );

  app.use(
    "/upload",
    createProxyMiddleware({
      target,
      changeOrigin: true,
      pathRewrite: { "^/upload": "/api/upload" },
    })
  );
};

