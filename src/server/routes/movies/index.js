const authCtrl = require('../../controllers/auth.controller');
const movieCtrl = require('../../controllers/movie.controller');

const movies = (router) => {
  router.route('/api/movie/create')
    .post(authCtrl.requireSignin, authCtrl.hasAuthorization, movieCtrl.upload.single('image'), movieCtrl.create);

  router.route('/api/movie/id/:movieId')
    .put(authCtrl.requireSignin, authCtrl.hasAuthorization, movieCtrl.upload.single('image'), movieCtrl.update)
    .get(authCtrl.requireSignin, movieCtrl.read);

  router.route('/api/movie/title/:movieTitle')
    .get(authCtrl.requireSignin, movieCtrl.read);

  router.route('/api/movie/list')
    .get(movieCtrl.list);

  router.param('movieId', movieCtrl.movieById);
  router.param('movieTitle', movieCtrl.movieByTitle);
}

module.exports = movies;
