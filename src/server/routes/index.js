const auth = require('./auth');

const routes = (router) => {
  auth(router);
  return router;
}

module.exports = routes;
