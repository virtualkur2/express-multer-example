const auth = require('./auth');
const users = require('./users');

const routes = (router) => {
  auth(router);
  users(router);
  return router;
}

module.exports = routes;
