const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // Proxy requests starting with /api
    createProxyMiddleware({
      target: 'https://otd.delhi.gov.in', // The target backend API
      changeOrigin: true, // This helps with origin issues when proxying
      pathRewrite: {
        '^/api': '', // This removes the /api part from the URL before forwarding
      },
    })
  );
};
