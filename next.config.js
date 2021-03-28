const Config = require('./src/utils/config');
const webpackConfig = require('./webpack.config');

module.exports = {
  dir: './src',
  webpack: (config, { dev }) => webpackConfig(config, { dev }),
};
