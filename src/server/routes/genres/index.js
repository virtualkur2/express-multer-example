const authCtrl = require('../../controllers/auth.controller');
const genreCtrl = require('../../controllers/genre.controller');

const genres = (router) => {
  router.route('/api/genre/list')
    .get(genreCtrl.list);

  router.route('/api/genre/create')
    .post(genreCtrl.create);

  router.route('/api/genre/id/:genreId')
    .get(genreCtrl.read)
    .put(genreCtrl.update)
    .delete(genreCtrl.remove);

  router.route('/api/genre/name/:genreName')
    .get(genreCtrl.read);

  router.param('genreId', genreCtrl.genreById);
  router.param('genreName', genreCtrl.genreByName);

  return router;
}

module.exports = genres;
