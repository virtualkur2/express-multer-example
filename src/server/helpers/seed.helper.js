const ObjectId = require('mongoose').Types.ObjectId;
const dbHelper = require('./db.helper');
const User = require('../models/user.model');
const Movie = require('../models/movie.model');
const Genre = require('../models/genre.model');

const insertDocuments = (documents, collectionName, db) => {
  return new Promise((resolve, reject) => {
    if(!db) {
      return reject(new Error('No db instance!'));
    }
    if(!documents) {
      return reject(new Error('Missing documents!'));
    }
    if(!collectionName) {
      return reject(new Error('No collectionName specified!'));
    }

    collectionName = collectionName.toLowerCase();

    const insertCallback = (error, results) => {
      if(error) {
        console.log(error);
        dbHelper.disconnect();
        return reject(error);
      }
      console.log(`All documents were inserted in ${collectionName} collection.`);
      return resolve(results);
    }

    db.connection.dropCollection(collectionName)
      .then((dropped) => {
        if(!dropped) {
          return reject(new Error(`Something went wrong dropping ${collectionName} collection!`));
        }
        switch(collectionName) {
          case 'users':
            User.insertMany(documents, { ordered: true }, insertCallback);
            break;
          case 'genres':
            Genre.insertMany(documents, { ordered: true }, insertCallback);
            break;
          case 'movies':
            Movie.insertMany(documents, { ordered: true }, insertCallback);
            break;
          default:
            return reject(new Error('No valid collectionName specified!'));
        }
      })
      .catch((error) => {
        console.log(error.message);
        return reject(error);
      });
  });
}

const users = [
  { _id: ObjectId(), name: 'Ceci', lastname: 'Responde', email: 'ceci.responde@email.com', password: 'myV3ryS3c5r3Passw0rd', isAdmin: true },
  { _id: ObjectId(), name: 'Mauricio', lastname: 'Contreras', email: 'mauricio.contreras@email.com', password: 'myV3ryS3c5r3Passw0rd', isAdmin: true },
  { _id: ObjectId(), name: 'Juan', lastname: 'Perez', email: 'juan.perez@email.com', password: 'juanperez', isAdmin: false },
  { _id: ObjectId(), name: 'Maria', lastname: 'Gutierrez', email: 'maria.gutierrez@email.com', password: '#@T$jhg&67Dru0', isAdmin: false }
];
const genres = [
  { _id: ObjectId(), name: 'Drama', createdAt: {date: Date.now(), by: users[0]._id} },
  { _id: ObjectId(), name: 'Comedia', createdAt: {date: Date.now(), by: users[1]._id} },
  { _id: ObjectId(), name: 'Musical', createdAt: {date: Date.now(), by: users[0]._id} },
  { _id: ObjectId(), name: 'Acción', createdAt: {date: Date.now(), by: users[0]._id} },
  { _id: ObjectId(), name: 'Terror', createdAt: {date: Date.now(), by: users[1]._id} },
  { _id: ObjectId(), name: 'Policial', createdAt: {date: Date.now(), by: users[1]._id} },
  { _id: ObjectId(), name: 'Ficción', createdAt: {date: Date.now(), by: users[1]._id} },
  { _id: ObjectId(), name: 'Romántica', createdAt: {date: Date.now(), by: users[0]._id} },
  { _id: ObjectId(), name: 'Familia', createdAt: {date: Date.now(), by: users[0]._id} },
  { _id: ObjectId(), name: 'Crimen', createdAt: {date: Date.now(), by: users[1]._id} },
  { _id: ObjectId(), name: 'Thriller', createdAt: {date: Date.now(), by: users[1]._id} },
  { _id: ObjectId(), name: 'Misterio', createdAt: {date: Date.now(), by: users[0]._id} },
  { _id: ObjectId(), name: 'Aventura', createdAt: {date: Date.now(), by: users[0]._id} },
  { _id: ObjectId(), name: 'Fantasía', createdAt: {date: Date.now(), by: users[1]._id} },
  { _id: ObjectId(), name: 'Animada', createdAt: {date: Date.now(), by: users[1]._id} },
  { _id: ObjectId(), name: 'Horror', createdAt: {date: Date.now(), by: users[0]._id} },
];
const movies = [
  { _id: ObjectId(), title: 'Titanic', genres: [{ _id: genres[0]._id }, { _id: genres[7]._id}], createdAt: { date: Date.now(), by: users[0]._id} },
  { _id: ObjectId(), title: 'Sospechosos habituales', genres: [{ _id: genres[9]._id }, { _id: genres[10]._id }, { _id: genres[11]._id }], createdAt: { date: Date.now(), by: users[0]._id} },
  { _id: ObjectId(), title: 'El señor de los anillos: La comunidad del anillo', genres: [{ _id: genres[6]._id }], createdAt: { date: Date.now(), by: users[1]._id} },
  { _id: ObjectId(), title: '¿Qué pasó ayer?', genres: [{ _id: genres[1]._id }], createdAt: { date: Date.now(), by: users[1]._id} },
  { _id: ObjectId(), title: 'Duro de Matar', genres: [{ _id: genres[3]._id }, { _id: genres[10]._id }], createdAt: { date: Date.now(), by: users[1]._id} },
  { _id: ObjectId(), title: 'High School Musical', genres: [{ _id: genres[1]._id }, { _id: genres[0]._id }, { _id: genres[8]._id }], createdAt: { date: Date.now(), by: users[1]._id} },
  { _id: ObjectId(), title: 'Crepúsculo', genres: [{ _id: genres[0]._id }, { _id: genres[13]._id }, { _id: genres[7]._id }], createdAt: { date: Date.now(), by: users[0]._id} },
  { _id: ObjectId(), title: 'It', genres: [{ _id: genres[15]._id }], createdAt: { date: Date.now(), by: users[0]._id} },
];

const seed = () => {
  dbHelper.connect()
    .then(async (db) => {
      console.log('Inserting documents:');
      insertedUsers = await insertDocuments(users, 'users', db);
      console.log('Inserted documents in users collection: ', insertedUsers.length);
      insertedGenres = await insertDocuments(genres, 'genres', db);
      console.log('Inserted documents in genres collection: ', insertedGenres.length);
      insertedMovies = await insertDocuments(movies, 'movies', db);
      console.log('Inserted documents in genres collection: ', insertedMovies.length);
      console.log('Wait 3 seconds until connection is closed...');
      setTimeout(dbHelper.disconnect, 3000);
    })
    .catch((error) => {
      console.log(error.message);
    });

}

console.log('Atención: Esto eliminará todos los datos actuales de las colecciones "users", "genres" y "movies"');
console.log('Si desea abortar presione <ctrl + c>, de lo contrario espere 10 segundos...');
setTimeout(seed, 10000);
