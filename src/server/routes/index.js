const auth = require('./auth');
const users = require('./users');
const movies = require('./movies');

const routes = (router) => {
  auth(router);
  users(router);
  movies(router);
  return router;
}

module.exports = routes;
