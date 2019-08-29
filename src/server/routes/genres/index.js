const authCtrl = require('../../controllers/auth.controller');
const genreCtrl = require('../../controllers/genre.controller');

const genres = (router) => {
  router.route('/api/genre/list')
    .get(genreCtrl.list);

  return router;
}

module.exports = genres;
