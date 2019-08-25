const authCtrl = require('../../controllers/auth.controller');
const movieCtrl = require('../../controllers/movie.controller');

const movies = (router) => {
  router.route('/api/movies/create')
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
  router.route('/api/movies/list')
    .get(movieCtrl.list);
}

module.exports = movies;
