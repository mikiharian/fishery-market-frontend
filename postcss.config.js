const Config = require('./src/utils/config');

module.exports = () => {
  const {
    DEV
  } = Config;
  const config = {
    plugins: {
      'postcss-easy-import': {
        prefix: '_'
      },
      cssnano: !DEV,
      'postcss-prefix-url': {
        prefix: '/'
      }
    }
  };

  return config;
};
