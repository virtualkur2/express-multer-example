const authCtrl = require('../../controllers/auth.controller');
const movieCtrl = require('../../controllers/movie.controller');

const movies = (router) => {
  router.route('/api/movies/list')
    .get(movieCtrl.list);
}

module.exports = movies;
