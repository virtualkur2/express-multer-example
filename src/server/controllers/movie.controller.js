const Movie = require('../models/movie.model');
const uploadHelper = require('../helpers/file.upload.helper');


const movieImagesPath = './src/server/public/images/movies';
const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new TypeError('Only images are allowed'), false);
  }
  cb(null, true);
}

const uploadImage = uploadHelper.uploadFile(movieImagesPath, imageFilter);
const unlinkImage = uploadHelper.unlinkFile;

const controller = {
    list: (req, res, next) => {
      // Check validity of limit, 50 documents is a low quantity of documents to fetch
      // but a high quantity for pagination purposes.
      // Indeed, we let the user to specify limit=0, as this mean 'no limit' at all
      // but that's mean no pagination either.

      let limit = (isNaN(parseInt(req.query.limit)) || parseInt(req.query.limit) < 0) ? 0 : (parseInt(req.query.limit) > 50 ? 50 : parseInt(req.query.limit));
      let page = (isNaN(parseInt(req.query.page)) || parseInt(req.query.page) < 0 || !limit) ? 0 : parseInt(req.query.page);
      paginateMovies(page, limit).exec((err, movies) => {
        if(err) {
          console.log(err);
          return next(err);
        }
        Movie.estimatedDocumentCount((err, total) => {
          if(err) {
            console.log(err.message);
            return next(err);
          }
          console.log(total);
          return res.status(200).json({movies, total});
        });
      });
    },
    create: (req, res, next) => {
      let movie = new Movie(req.body);

      if(req.file) {
        movie.image = req.file.filename;
      }

      movie.save((error, newMovie) => {
        //this is tricky:
        // if movie has a validation error then it's neccesary to delete (unlink)
        // uploaded image.
        // maybe if we implement a validation middleware in front of the upload
        // process, then we will be saving some IO resources.
        // TODO: create a validation middleware to do that
        if(error) {
          console.log(error.message);
          return unlinkImage(movieImagesPath, req.file.filename, (err, unlinked) => {
            if(err) {
              console.log(err.message);
              console.log(`Conflictive path: ${err.fullPath}`);
              err.httpStatusCode(500);
              return next(err);
            }
            return next(error);
          });
        }
        return res.status(200).json({
          message: 'Successfully created movie!'
        });
      });
    },
    read: (req,res,next) => {
      return res.status(200).json(req.movie.getInfo());
    },
    update: (req, res, next) => {

    },
    remove: (req, res, next) => {

    },
    movieById: (req, res, next, id) => {
      const populateCreatedBy = {
        path: 'createdBy',
        select: 'name lastname'
      };
      const populateGenres = {
        path: 'genres',
        select: 'name'
      };
      Movie.findById(id)
      .populate(populateCreatedBy)
      .populate(populateGenres)
      .exec((err, movie) => {
        if(err) {
          console.log(err.message);
          return next(err);
        }
        if(!movie) {
          const err = new Error('Movie not found');
          err.httpStatusCode = 404;
          return next(err);
        }
        req.movie = movie;
        next();
      });
      // Movie.findById(id)
      //   .exec(
      //     (err, movie) => {
      //     if(err) {
      //       return next(err);
      //     }
      //     if(!movie) {
      //       const err = new Error('Movie not found');
      //       err.httpStatusCode = 404;
      //       return next(err);
      //     }
      //     req.movie = movie;
      //     next();
      //   });
    },
    movieByTitle: (req, res, next, title) => {
      Movie.find({title: title}).exec(findMovieCallback);
    },
    upload: uploadImage,

}

const findMovieCallback = (err, movie) => {
  if(err) {
    return next(err);
  }
  if(!movie) {
    const err = new Error('Movie not found');
    err.httpStatusCode = 404;
    return next(err);
  }
  req.movie = movie;
  next();
}

const paginateMovies = (pageNumber, nPerPage) => {
  const cursor = Movie.find()
                  .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0 )
                  .limit(nPerPage);
  return cursor;
}



module.exports = controller;
