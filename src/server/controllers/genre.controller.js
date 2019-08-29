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
      return res.status(200).json(genres);
    });
  }
}

module.exports = controller;
