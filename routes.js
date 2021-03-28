const routes = require('next-routes')();

routes
  .add({
    page: 'home',
    name: '/',
    pattern: '/'
  })

module.exports = routes;
