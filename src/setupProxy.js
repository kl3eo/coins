const proxy = require('http-proxy-middleware');
module.exports = function(app) {
  app.use(
//    '/exchange-api/v1/public/asset-service/product/get-products',
'/api/v3/depth',
    proxy({
      target: 'https://www.binance.com',
      changeOrigin: true,
    })
  );
};
