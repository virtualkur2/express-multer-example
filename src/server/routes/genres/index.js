const authCtrl = require('../../controllers/auth.controller');
const genreCtrl = require('../../controllers/genre.controller');

const genres = (router) => {
  router.route('/api/genre/list')
    .get(genreCtrl.list);

  router.route('/api/genre/create')
    .post(genreCtrl.create);

  return router;
}

module.exports = genres;
