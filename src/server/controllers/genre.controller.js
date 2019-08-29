const Genre = require('../models/genre.model');

const controller = {
  list: (req, res, next) => {
    Genre.find().exec((err, genres) => {
      if(err) {
        console.log(err.message);
        return next(err);
      }
      if(!genres.length) {
        const err = new Error('No Genres found.');
        err.httpStatusCode = 404;
        return next(err);
      }
      let result = genres.map((genre) => {
        return genre.getInfo();
      });
      return res.status(200).json(result);
    });
  },
  create: (req, res, next) => {
    let genre = new Genre(req.body);
    genre.save((err, newGenre) => {
      if(err) {
        console.log(err.message);
        return next(err);
      }
      return res.status(200).json({
        message: 'Genre succesfully created.'
      });
    });
  },
  remove: (req, res, next) => {

  }
}

module.exports = controller;
