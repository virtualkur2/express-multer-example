const authCtrl = require('../../controllers/auth.controller');
const movieCtrl = require('../../controllers/movie.controller');

const movies = (router) => {
  router.route('/api/movie/create')
    .get((req, res, next) => {
      const template = `
      <form action="/api/movies/create" method="post" enctype="multipart/form-data">
        <label for="title">Title</label><br>
        <input type="text" name="title"/><br>
        <label for="image">Image</label><br>
        <input type="file" name="image" /><br>
        <button type="submit">Enviar</button>
      </form>
      `;
      return res.status(200).send(template);
    })
    .post(movieCtrl.upload.single('image'), movieCtrl.create);

  router.route('/api/movie/id/:movieId')
    .put(movieCtrl.upload.single('image'), movieCtrl.update)
    .get(movieCtrl.read);

  router.route('/api/movie/title/:movieTitle')
    .get(movieCtrl.read);

  router.route('/api/movie/list')
    .get(movieCtrl.list);

  router.param('movieId', movieCtrl.movieById);
  router.param('movieTitle', movieCtrl.movieByTitle);
}

module.exports = movies;
