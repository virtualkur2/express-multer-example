const server = require('./server');
const config = require('./config');
const dbHelper = require('./server/helpers/db.helper');

const app = server();
console.info('Starting app...');
//try to connect to db:
dbHelper.connect()
  .then(() => {
    console.info('Starting server...');
    app.listen(config.port, (err) => {
      if(err) {
        console.error(err.message);
        process.exit(1);
      }
      console.log(`Server started and listening on port: ${config.port}`);
    });
  })
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  });


process.on('beforeExit', () => {
  console.log('Preparing for close app...');
  dbHelper.disconnect()
    .then(() => {
      console.info('...');
    })
    .catch((err) => {
      console.error('Error: ', err);
    });
});

process.on('exit', (exitCode) => {
  console.info('===> A process.exit() was called with code ', exitCode);
  console.info('...closing app.')
  console.info('Bye');
});

process.on('SIGINT', () => {
  console.info('\n===> <ctrl+c> detected');
  dbHelper.disconnect()
    .then(() => {
      console.info('...');
    })
    .catch((err) => {
      console.error('Error: ', err);
    });
  process.exit(1);
});
