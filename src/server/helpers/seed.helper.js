const ObjectId = require('mongoose').Types.ObjectId;
const DBHelper = require('./db.helper');
const User = require('../models/user.model');
const Movie = require('../models/movie.model');
const Genre = require('../models/genre.model');

const users = [
  { _id: ObjectId(), name: 'Ceci', lastname: 'Responde', email: 'ceci.responde@email.com', password: 'myV3ryS3c5r3Passw0rd', isAdmin: true },
  { _id: ObjectId(), name: 'Mauricio', lastname: 'Contreras', email: 'mauricio.contreras@email.com', password: 'myV3ryS3c5r3Passw0rd', isAdmin: true },
  { _id: ObjectId(), name: 'Juan', lastname: 'Perez', email: 'juan.perez@email.com', password: 'juanperez', isAdmin: false },
  { _id: ObjectId(), name: 'Maria', lastname: 'Gutierrez', email: 'maria.gutierrez@email.com', password: '#@T$jhg&67Dru0', isAdmin: false }
];
const genres = [
  { _id: ObjectId(), name: 'Drama', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Comedia', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Musical', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Acción', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Terror', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Policial', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Ficción', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Romántica', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Familia', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Crimen', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Thriller', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Misterio', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Aventura', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Fantasía', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Animada', createdAt: Date.now()},
  { _id: ObjectId(), name: 'Horror', createdAt: Date.now()},
];

const genreCreatedBy = [
  users[0]._id,
  users[1]._id,
  users[0]._id,
  users[0]._id,
  users[1]._id,
  users[1]._id,
  users[1]._id,
  users[0]._id,
  users[0]._id,
  users[1]._id,
  users[1]._id,
  users[0]._id,
  users[0]._id,
  users[1]._id,
  users[1]._id,
  users[0]._id,
];

const movies = [
  { _id: ObjectId(), title: 'Titanic', image: 'altbikl9rvoktafphfml1zwmnmjwxwhp.jpg', createdAt: Date.now() },
  { _id: ObjectId(), title: 'Sospechosos habituales', image: 'e96xugs8ap88ui6ye91t7jq9vwdwt6to.jpg', createdAt: Date.now() },
  { _id: ObjectId(), title: 'El señor de los anillos: La comunidad del anillo', image: 'm7ebm4krv28xzmmvxmzfon6dey2yk00w.jpg', createdAt: Date.now() },
  { _id: ObjectId(), title: '¿Qué pasó ayer?', image: 'xms26o73p21kyrbuwlq074p99wcxbmwy.jpg', createdAt: Date.now() },
  { _id: ObjectId(), title: 'Duro de Matar', image: '4zvv1ki7jtb5kx0qxxlc3z4sryglge8s.jpg', createdAt: Date.now() },
  { _id: ObjectId(), title: 'High School Musical', image: 'hsdwnezea815g87s03jdglc4xpy6tq62.jpg', createdAt: Date.now() },
  { _id: ObjectId(), title: 'Crepúsculo', image: '82j6qvrcla0b3o1inunsr9zg7rdrwmu9.jpg', createdAt: Date.now() },
  { _id: ObjectId(), title: 'It', image: '6t9a8t1uuamg358ivd4dgweq2be576uh.jpg', createdAt: Date.now() },
];

const movieGenres = [
  [genres[0]._id, genres[7]._id],
  [genres[9]._id, genres[10]._id, genres[11]._id ],
  [genres[6]._id],
  [genres[1]._id],
  [genres[3]._id, genres[10]._id ],
  [genres[1]._id, genres[0]._id, genres[8]._id],
  [genres[0]._id, genres[13]._id, genres[7]._id],
  [genres[15]._id ],
];

const movieCreatedBy = [
  users[0]._id,
  users[0]._id,
  users[1]._id,
  users[1]._id,
  users[1]._id,
  users[1]._id,
  users[0]._id,
  users[0]._id,
];

const dropCollections = (db, collections) => {
  return new Promise((resolve, reject) => {
    let dropped = collections.map((collection) => {
      return db.connection.dropCollection(collection);
    });
    Promise.all(dropped)
    .then((results) => {
      results.forEach((result, i) => {
        console.log(`Collection ${collections[i]} dropped: ${result}.`);
      });
      resolve(db);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

const insertDocuments = (db, Model, documents) => {
  return new Promise((resolve, reject) => {
    let inserted = documents.map((document, i) => {
      let doc = new Model(document);
      if(Model.collection.collectionName === 'genres') {
        doc.createdBy = genreCreatedBy[i];
      }
      if(Model.collection.collectionName === 'movies') {
        doc.createdBy = movieCreatedBy[i];
        movieGenres[i].forEach((genre) => {
          doc.genres.push(genre);
        });
      }
      return doc.save()
    });
    Promise.all(inserted)
    .then((results) => {
      results.forEach((result) => {
        console.log(`Document inserted in ${Model.collection.collectionName} with _id: ${result._id}`);
      });
      resolve(db);
    })
    .catch((error) => {
      reject(error);
    });
  });
}

// Add any collection you want to be dropped
const collectionNames = ['users', 'genres', 'movies'];

const seed = () => {
  DBHelper.connect()
    .then((db) => {
      console.log('Droping collections...');
      return dropCollections(db, collectionNames)
    })
    .then((db) => {
      console.log('Collections dropped.');
      console.log('Inserting users...');
      return insertDocuments(db, User, users);
    })
    .then((db) => {
      console.log('Users inserted.');
      console.log('Inserting genres');
      return insertDocuments(db, Genre, genres);
    })
    .then((db) => {
      console.log('Genres inserted.');
      console.log('Inserting movies...')
      return insertDocuments(db, Movie, movies);
    })
    .then((db) => {
      console.log('Movies inserted.');
      console.log('Wait 3 seconds to disconnect from database...');
      setTimeout(DBHelper.disconnect, 3000);
    })
    .catch((error) => {
      console.log(error.message);
      console.log('Wait 3 seconds to disconnect from database...');
      setTimeout(DBHelper.disconnect, 3000);
    });
}

console.log(`Atención: Esto eliminará todos los datos actuales de las siguientes colecciones: ${collectionNames}.`);
console.log('Si desea abortar presione < ctrl + c >, de lo contrario espere 5 segundos...');
setTimeout(seed, 5000);
