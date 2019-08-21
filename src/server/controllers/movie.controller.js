const Movie = require('../models/movie.model');

const controller = {
    list: (req, res, next) => {
      // Check validity of limit, 50 documents is a low quantity of documents to fetch
      // Indeed, we let the user to specify limit=0, as this mean 'no limit' at all
      let limit = req.query.limit ? parseInt(req.query.limit) : 0;
      if(isNaN(limit) || limit < 0 || limit > 50) limit = 50;

      let page = parseInt(req.query.page);
      // check for pagination
      if(isNaN(page) || page < 0) { // no pagination
        getMovies(limit).exec((err, movies) => {
          if(err) {
            console.log(err.message);
            return next(err);
          }
          return res.status(200).json(movies);
        });
      } else { //pagination requested
        if(!limit) limit = 10; //default limit for page
        paginateMovies(page, limit).exec((err, movies) => {
          if(err) {
            console.log(err);
            return next(err);
          }
          return res.status(200).json(movies);
        });
      }
    }
}

const paginateMovies = (pageNumber, nPerPage) => {
  const cursor = Movie.find()
                  .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0 )
                  .limit(nPerPage);
  return cursor;
}

const getMovies = (limit) => {
  const cursor = Movie.find().limit(limit);
  return cursor;
}

module.exports = controller;
