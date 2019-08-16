const server = require('./server');

const app = server();

app.listen(3000, () => {
  console.log('App listening on port 3000');
});
