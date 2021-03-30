const fs = require('fs').promises;
const moment = require('moment');
const Config = require('./config');

const MANIFEST = {
  short_name: `Fishery Market`,
  name: 'Fishery Market: Cek harga komoditas di indonesia',
  display: 'standalone',
  orientation: 'portrait',
  scope: '/',
  start_url: '/',
  theme_color: '#28B796',
  background_color: '#ffffff',
  splash_pages: null,
  icons: [
    {
      "src": "/static/images/favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "/static/images/logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/static/images/logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ]
};

const robots = `User-Agent: *
Sitemap: ${Config.BASE_DOMAIN}/sitemap.xml`;

const timestamp =  moment().format('YYYYMMDD');

Promise.all([
  fs.writeFile('./build.dot', timestamp, 'utf8').catch(err => `Error writing build.dot: ${err.message}`),
  fs.writeFile('./src/static/manifest.json', JSON.stringify(MANIFEST, null, 2)).catch(err => `Error writing manifest.json: ${err.message}`),
  fs.writeFile('./src/static/robots.txt', robots, 'utf8').catch(err => `Error writing robots.txt: ${err.message}`)
])
  .then(() => {
    fs.readFile('./src/utils/config.js', 'utf8')
      .then((data) => {
        const temp = data
          .replace('module.exports = {\n', `module.exports = {\n  TIMESTAMP: ${timestamp},\n`);

        return fs.writeFile('./src/utils/config.js', temp, 'utf8');
      })
      .catch(err => `Error writing utils.js: ${err.message}`);
  })
  .catch((err) => {
    throw err;
  });
