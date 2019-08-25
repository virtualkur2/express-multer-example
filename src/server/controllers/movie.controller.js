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
      console.log(req.body.title);
      if(req.file) {
        movie.image = req.file.filename;
      }

      movie.save((error, newMovie) => {
        if(error) {
          console.log(error.message);
          unlinkImage(movieImagesPath, req.file.filename, (err, unlinked) => {
            if(err) {
              console.log(err.message);
              console.log(`Conflictive path: ${err.fullPath}`);
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
    read: (req, res, next) => {

    },
    upload: uploadImage,
}


const paginateMovies = (pageNumber, nPerPage) => {
  const cursor = Movie.find()
                  .skip(pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0 )
                  .limit(nPerPage);
  return cursor;
}

module.exports = controller;
