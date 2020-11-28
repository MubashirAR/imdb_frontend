const proxy = require("http-proxy-middleware");
const NODE_ENV = process.env.NODE_ENV
module.exports = function(app) {
  if(NODE_ENV === 'production') return;
  app.use(proxy('/api/**', { target: 'http://localhost:8000', prependPath: false, pathRewrite: {
    '^/api/': '/'
  } }));
};