const authCtrl = require('../../controllers/auth.controller');
const movieCtrl = require('../../controllers/movie.controller');

const movies = (router) => {
  router.route('/api/movies/list')
    .get(authCtrl.requireSignin, movieCtrl.list);
}

module.exports = movies;
