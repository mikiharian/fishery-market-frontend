const express = require('express');
const next = require('next');
const bodyParser = require('body-parser');

const routes = require('./routes');
const Config = require('./src/utils/config');

const app = next({
  dev: Config.DEV,
  dir: './src',
  useFileSystemPublicRoutes: false
});
const handler = routes.getRequestHandler(app);
const { PORT } = Config;

app.prepare().then(() => {
  const server = express();
  server.use(bodyParser.json());

  server.get('*', (req, res) => {
    return handler(req, res);
  });

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`=======> App running on port ${PORT} <=======`);
    process.on('unhandledRejection', (reason, p) => {
      console.log('==== > Unhandled Rejection at: Promise', p, '\n===== > reason:', reason);
    });
  });
});
