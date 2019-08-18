const server = require('./server');
const config = require('./config');

const app = server();
app.listen(config.port, () => {
  console.log(`Server started and listening on port: ${config.port}`);
});
