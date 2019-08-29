const auth = require('./auth');
const users = require('./users');
const movies = require('./movies');
const genres = require('./genres');

const routes = (router) => {
  auth(router);
  users(router);
  movies(router);
  genres(router);
  return router;
}

module.exports = routes;
